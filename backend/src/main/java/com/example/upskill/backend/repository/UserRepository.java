package com.example.upskill.backend.repository;

import com.example.upskill.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}