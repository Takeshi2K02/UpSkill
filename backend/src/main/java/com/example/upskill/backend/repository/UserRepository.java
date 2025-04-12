package com.example.upskill.backend.repository;

import com.example.upskill.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
