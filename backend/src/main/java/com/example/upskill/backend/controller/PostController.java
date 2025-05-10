package com.example.upskill.backend.controller;

import com.example.upskill.backend.dto.PostResponse;
import com.example.upskill.backend.model.Comment;
import com.example.upskill.backend.model.CommunityGroup;
import com.example.upskill.backend.model.Notification;
import com.example.upskill.backend.model.Post;
import com.example.upskill.backend.model.User;
import com.example.upskill.backend.repository.CommunityGroupRepository;
import com.example.upskill.backend.repository.NotificationRepository;
import com.example.upskill.backend.repository.PostRepository;
import com.example.upskill.backend.repository.UserRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired private PostRepository postRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CommunityGroupRepository groupRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private Cloudinary cloudinary;

    @PostMapping
    public Post createPost(
            @RequestParam String userId,
            @RequestParam String content,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) throws IOException {
        Post post = new Post(userId, content);
        handleAttachments(post, files);
        return postRepository.save(post);
    }

    @GetMapping
    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findByGroupIdIsNullOrderByCreatedAtDesc();
        return posts.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestParam String content,
            @RequestParam(value = "removedAttachments", required = false) String removedJson,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) throws IOException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));
        post.setContent(content);
        post.setUpdatedAt(Instant.now());

        if (removedJson != null) {
            List<String> removed = objectMapper.readValue(removedJson, new TypeReference<>() {});
            List<String> keep = post.getAttachments().stream()
                    .filter(a -> !removed.contains(a))
                    .collect(Collectors.toList());
            post.setAttachments(keep);
        }
        handleAttachments(post, files);
        return ResponseEntity.ok(postRepository.save(post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        postRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public Post likePost(@PathVariable String id, @RequestBody Map<String,String> body) {
        String userId = body.get("userId");
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));

        boolean isLiked = !post.getLikes().remove(userId);
        if (isLiked) {
            post.getLikes().add(userId);
            if (!post.getUserId().equals(userId)) {
                Notification notification = new Notification();
                notification.setRecipientId(post.getUserId());
                notification.setSenderId(userId);
                notification.setPostId(post.getId());
                notification.setType("LIKE");
                notification.setMessage(userRepository.findById(userId).map(User::getName).orElse("Someone") + " liked your post.");
                notificationRepository.save(notification);
            }
        }

        return postRepository.save(post);
    }

    @PostMapping("/{id}/comments")
    public Post addComment(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String content = payload.get("content");
        if (userId == null || userId.isEmpty()) throw new IllegalArgumentException("User ID is required");
        if (content == null || content.isEmpty()) throw new IllegalArgumentException("Content is required");

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        if (post.getComments() == null) post.setComments(new ArrayList<>());

        Comment comment = new Comment(userId, content);
        post.getComments().add(comment);

        if (!post.getUserId().equals(userId)) {
            Notification notification = new Notification();
            notification.setRecipientId(post.getUserId());
            notification.setSenderId(userId);
            notification.setPostId(post.getId());
            notification.setType("COMMENT");
            notification.setMessage(userRepository.findById(userId).map(User::getName).orElse("Someone") + " commented on your post.");
            notificationRepository.save(notification);
        }

        return postRepository.save(post);
    }

    @GetMapping("/user/{userId}")
    public List<PostResponse> getPostsByUser(@PathVariable String userId) {
        return postRepository.findByUserIdAndGroupIdIsNullOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/groups/{groupId}")
    public List<PostResponse> getPostsByGroup(@PathVariable String groupId) {
        return postRepository.findByGroupIdOrderByCreatedAtDesc(groupId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping("/groups/{groupId}")
    public Post createGroupPost(
            @PathVariable String groupId,
            @RequestParam String userId,
            @RequestParam String content,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) throws IOException {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Unknown user: " + userId));
        if (!"USER".equals(u.getRole())) throw new RuntimeException("Only normal users can post in groups");

        CommunityGroup g = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found: " + groupId));
        if (!g.getMembers().contains(userId)) throw new RuntimeException("User is not a member of group");

        Post p = new Post(userId, groupId, content);
        handleAttachments(p, files);
        return postRepository.save(p);
    }

    @DeleteMapping("/groups/{groupId}/{postId}")
    public ResponseEntity<?> deleteGroupPost(
            @PathVariable String groupId,
            @PathVariable String postId,
            @RequestBody Map<String,String> body
    ) {
        String userId = body.get("userId");
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Unknown user: " + userId));
        if (!"ADMIN".equals(u.getRole())) throw new RuntimeException("Only admins can delete group posts");

        postRepository.deleteById(postId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public Post deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestParam String userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));

        boolean commentRemoved = post.getComments().removeIf(comment ->
                comment.getId().equals(commentId) &&
                (comment.getUserId().equals(userId) || post.getUserId().equals(userId)));

        if (!commentRemoved) throw new RuntimeException("Comment not found or user not authorized to delete");

        return postRepository.save(post);
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public Post editComment(
        @PathVariable String postId,
        @PathVariable String commentId,
        @RequestParam String userId,
        @RequestBody String newContent) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found: " + postId));

        post.getComments().forEach(comment -> {
            if (comment.getId().equals(commentId) && comment.getUserId().equals(userId)) {
                comment.setContent(newContent);
            }
        });

        return postRepository.save(post);
    }

    private void handleAttachments(Post post, MultipartFile[] files) throws IOException {
        if (files != null && files.length > 0) {
            List<String> urls = new ArrayList<>(post.getAttachments());
            for (MultipartFile f : files) {
                Map result = cloudinary.uploader()
                        .upload(f.getBytes(), ObjectUtils.asMap("resource_type","auto"));
                urls.add((String) result.get("secure_url"));
            }
            post.setAttachments(urls);
        }
    }

    private PostResponse toResponse(Post post) {
        PostResponse r = new PostResponse();
        r.setId(post.getId());
        r.setContent(post.getContent());
        r.setCreatedAt(post.getCreatedAt());
        r.setLikeCount(post.getLikes().size());
        r.setCommentCount(post.getComments().size());
        r.setAttachments(post.getAttachments());
        userRepository.findById(post.getUserId()).ifPresent(u -> {
            r.setUserId(u.getId());
            r.setUserName(u.getName());
        });
        List<Comment> enriched = post.getComments().stream().map(c -> {
            Comment nc = new Comment(c.getUserId(), c.getContent());
            nc.setCreatedAt(c.getCreatedAt());
            userRepository.findById(c.getUserId()).ifPresent(u -> nc.setUserName(u.getName()));
            return nc;
        }).collect(Collectors.toList());
        r.setComments(enriched);
        return r;
    }
}