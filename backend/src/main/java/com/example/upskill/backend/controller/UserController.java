package com.example.upskill.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.upskill.backend.model.User;
import com.example.upskill.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String query) {
        return userRepository.findByNameContainingIgnoreCase(query);
    }

    @GetMapping("/{userId}/isFollowing/{targetUserId}")
    public Map<String, Boolean> isFollowing(
            @PathVariable String userId,
            @PathVariable String targetUserId) {
        Optional<User> targetUser = userRepository.findById(targetUserId);
        Map<String, Boolean> response = new HashMap<>();
        
        if (targetUser.isPresent()) {
            boolean isFollowing = targetUser.get().getFollowers().contains(userId);
            response.put("isFollowing", isFollowing);
        } else {
            response.put("isFollowing", false);
        }
        
        return response;
    }

    @PostMapping("/{followerId}/follow/{followeeId}")
    public ResponseEntity<?> followUser(
            @PathVariable String followerId,
            @PathVariable String followeeId) {
        Optional<User> followerOpt = userRepository.findById(followerId);
        Optional<User> followeeOpt = userRepository.findById(followeeId);
        
        if (followerOpt.isEmpty() || followeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User follower = followerOpt.get();
        User followee = followeeOpt.get();
        
        // Add followee to follower's following list
        if (!follower.getFollowing().contains(followeeId)) {
            follower.getFollowing().add(followeeId);
            userRepository.save(follower);
        }
        
        // Add follower to followee's followers list
        if (!followee.getFollowers().contains(followerId)) {
            followee.getFollowers().add(followerId);
            userRepository.save(followee);
        }
        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{followerId}/unfollow/{followeeId}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable String followerId,
            @PathVariable String followeeId) {
        Optional<User> followerOpt = userRepository.findById(followerId);
        Optional<User> followeeOpt = userRepository.findById(followeeId);
        
        if (followerOpt.isEmpty() || followeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User follower = followerOpt.get();
        User followee = followeeOpt.get();
        
        // Remove followee from follower's following list
        follower.getFollowing().remove(followeeId);
        userRepository.save(follower);
        
        // Remove follower from followee's followers list
        followee.getFollowers().remove(followerId);
        userRepository.save(followee);
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/posts")
    public ResponseEntity<?> getUserPosts(@PathVariable String userId) {
        // You'll need to implement this based on your Post repository
        // Return the user's posts
        return ResponseEntity.ok().build();
    }
    // src/main/java/com/example/upskill/backend/controller/UserController.java
// Add this new endpoint
@PutMapping("/{id}")
public ResponseEntity<User> updateUser(
    @PathVariable String id,
    @RequestParam(value = "name", required = false) String name,
    @RequestParam(value = "bio", required = false) String bio,
    @RequestParam(value = "avatar", required = false) MultipartFile avatarFile,
    @Autowired Cloudinary cloudinary) throws IOException {
    
    Optional<User> userOpt = userRepository.findById(id);
    if (userOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    User user = userOpt.get();
    
    if (name != null) {
        user.setName(name);
    }
    
    if (bio != null) {
        user.setBio(bio);
    }
    
    if (avatarFile != null && !avatarFile.isEmpty()) {
        Map uploadResult = cloudinary.uploader().upload(avatarFile.getBytes(), 
            ObjectUtils.asMap("folder", "avatars"));
        user.setAvatar((String) uploadResult.get("secure_url"));
    }

    User updatedUser = userRepository.save(user);
    return ResponseEntity.ok(updatedUser);
}

    
}
