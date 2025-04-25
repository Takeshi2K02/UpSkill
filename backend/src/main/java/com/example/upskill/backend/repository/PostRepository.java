package com.example.upskill.backend.repository;

import com.example.upskill.backend.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {

    /** 
     * Fetch only “normal” (non‐group) posts by a specific user, newest first 
     */
    List<Post> findByUserIdAndGroupIdIsNullOrderByCreatedAtDesc(String userId);

    /** 
     * Fetch only “normal” (non‐group) posts — newest first 
     */
    List<Post> findByGroupIdIsNullOrderByCreatedAtDesc();

    /**
     * Fetch all posts in a particular community group, newest first
     */
    List<Post> findByGroupIdOrderByCreatedAtDesc(String groupId);

    /**
     * (Legacy) Fetch all posts regardless of grouping, newest first 
     */
    List<Post> findAllByOrderByCreatedAtDesc();
}