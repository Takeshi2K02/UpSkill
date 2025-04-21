package com.example.upskill.backend.controller;

import com.example.upskill.backend.model.Post;
import com.example.upskill.backend.model.User;
import com.example.upskill.backend.repository.PostRepository;
import com.example.upskill.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import java.io.IOException;
import java.time.Instant;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.cloudinary.utils.ObjectUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.example.upskill.backend.dto.PostResponse;
import com.example.upskill.backend.model.Comment;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    // Update createPost to handle file uploads
    @PostMapping
    public Post createPost(
            @RequestParam("userId") String userId,
            @RequestParam("content") String content,
            @RequestParam(value = "files", required = false) MultipartFile[] files) throws IOException {
        
        Post post = new Post(userId, content);
        
        if (files != null && files.length > 0) {
            List<String> attachmentUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                    ObjectUtils.asMap("resource_type", "auto"));
                attachmentUrls.add((String) uploadResult.get("secure_url"));
            }
            post.setAttachments(attachmentUrls);
        }
        
        return postRepository.save(post);
    }

    // Add endpoint to upload files to existing post
    @PostMapping("/{id}/attachments")
    public Post addAttachments(
            @PathVariable String id,
            @RequestParam("files") MultipartFile[] files) throws IOException {
        
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        
        List<String> attachmentUrls = new ArrayList<>();
        if (post.getAttachments() != null) {
            attachmentUrls.addAll(post.getAttachments());
        }
        
        for (MultipartFile file : files) {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("resource_type", "auto"));
            attachmentUrls.add((String) uploadResult.get("secure_url"));
        }
        
        post.setAttachments(attachmentUrls);
        return postRepository.save(post);
    }

    // Get all posts (sorted by newest first)
    @GetMapping
public List<PostResponse> getAllPosts() {
    List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
    return posts.stream().map(post -> {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setCreatedAt(post.getCreatedAt());
        response.setLikeCount(post.getLikes() != null ? post.getLikes().size() : 0);
        response.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);
        response.setComments(post.getComments());
        response.setAttachments(post.getAttachments());
        
        // Get post author info
        User postAuthor = userRepository.findById(post.getUserId()).orElse(null);
        if (postAuthor != null) {
            response.setUserId(postAuthor.getId());
            response.setUserName(postAuthor.getName());
        } else {
            response.setUserId(post.getUserId());
            response.setUserName("Unknown User");
        }
        
        // Get comment authors info
        if (post.getComments() != null) {
            List<Comment> commentsWithUserInfo = post.getComments().stream().map(comment -> {
                Comment newComment = new Comment(comment.getUserId(), comment.getContent());
                newComment.setCreatedAt(comment.getCreatedAt());
                
                // Look up comment author
                User commentAuthor = userRepository.findById(comment.getUserId()).orElse(null);
                if (commentAuthor != null) {
                    newComment.setUserName(commentAuthor.getName());
                }
                return newComment;
            }).collect(Collectors.toList());
            response.setComments(commentsWithUserInfo);
        }
        
        return response;
    }).collect(Collectors.toList());
}

    // Get a specific post by ID
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    @PutMapping("/{id}")
public ResponseEntity<Post> updatePost(
    @PathVariable String id,
    @RequestParam("content") String content,
    @RequestParam(value = "removedAttachments", required = false) String removedAttachmentsJson,
    @RequestParam(value = "files", required = false) MultipartFile[] files) throws IOException {
    
    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    
    post.setContent(content);
    post.setUpdatedAt(Instant.now());
    
    // Handle removed attachments
    if (removedAttachmentsJson != null) {
        List<String> removedAttachments = objectMapper.readValue(removedAttachmentsJson, new TypeReference<List<String>>() {});
        List<String> updatedAttachments = post.getAttachments()
                .stream()
                .filter(attachment -> !removedAttachments.contains(attachment))
                .collect(Collectors.toList());
        post.setAttachments(updatedAttachments);
    }
    
    // Handle new file uploads
    if (files != null && files.length > 0) {
        List<String> attachmentUrls = new ArrayList<>(post.getAttachments());
        for (MultipartFile file : files) {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("resource_type", "auto"));
            attachmentUrls.add((String) uploadResult.get("secure_url"));
        }
        post.setAttachments(attachmentUrls);
    }
    
    Post updatedPost = postRepository.save(post);
    return ResponseEntity.ok(updatedPost);
}

@DeleteMapping("/{id}")
public ResponseEntity<?> deletePost(@PathVariable String id) {
    postRepository.deleteById(id);
    return ResponseEntity.ok().build();
}

    @PostMapping("/{id}/like")
public Post likePost(@PathVariable String id, @RequestBody Map<String, String> payload) {
    String userId = payload.get("userId");
    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    
    // Ensure likes list is not null
    if (post.getLikes() == null) {
        post.setLikes(new ArrayList<>());
    }
    
    // Toggle like - if user already liked, unlike it; otherwise like it
    if (post.getLikes().contains(userId)) {
        post.getLikes().remove(userId);
    } else {
        post.getLikes().add(userId);
    }
    
    return postRepository.save(post);
}

@PostMapping("/{id}/unlike")
public Post unlikePost(@PathVariable String id, @RequestBody Map<String, String> payload) {
    String userId = payload.get("userId");
    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    
    // Ensure likes list is not null
    if (post.getLikes() == null) {
        post.setLikes(new ArrayList<>());
    }
    
    post.getLikes().remove(userId);
    return postRepository.save(post);
}

@PostMapping("/{id}/comments")
public Post addComment(@PathVariable String id, @RequestBody Map<String, String> payload) {
    String userId = payload.get("userId");
    String content = payload.get("content");
    
    Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    
    // Ensure comments list is not null
    if (post.getComments() == null) {
        post.setComments(new ArrayList<>());
    }
    
    Comment comment = new Comment(userId, content);
    post.getComments().add(comment);
    return postRepository.save(post);
}

@GetMapping("/user/{userId}")
public List<PostResponse> getPostsByUser(@PathVariable String userId) {
    List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    return posts.stream().map(post -> {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setCreatedAt(post.getCreatedAt());
        response.setLikeCount(post.getLikes() != null ? post.getLikes().size() : 0);
        response.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);
        response.setComments(post.getComments());
        response.setAttachments(post.getAttachments());

        // Get post author info
        User user = userRepository.findById(post.getUserId()).orElse(null);
        if (user != null) {
            response.setUserId(user.getId());
            response.setUserName(user.getName());
        } else {
            response.setUserId(post.getUserId());
            response.setUserName("Unknown User");
        }

        // Add comment author info to each comment
        if (post.getComments() != null) {
            List<Comment> commentsWithUserInfo = post.getComments().stream().map(comment -> {
                Comment newComment = new Comment(comment.getUserId(), comment.getContent());
                newComment.setCreatedAt(comment.getCreatedAt());

                // Look up comment author
                User commentAuthor = userRepository.findById(comment.getUserId()).orElse(null);
                if (commentAuthor != null) {
                    newComment.setUserName(commentAuthor.getName());
                }
                return newComment;
            }).collect(Collectors.toList());
            response.setComments(commentsWithUserInfo);
        }

        return response;
    }).collect(Collectors.toList());
}


    
}