package com.example.upskill.backend.repository;

import com.example.upskill.backend.model.User;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<User, String> {

    List<User> findByNameContainingIgnoreCase(String name);
    
    @Query("{'followers': ?0}")
    List<User> findByFollowerId(String followerId);
    
    @Query("{'following': ?0}")
    List<User> findByFollowingId(String followingId);
}