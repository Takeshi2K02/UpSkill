package com.example.upskill.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.upskill.backend.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdAndIsRead(String userId, boolean isRead);
    List<Notification> findByUserId(String userId);
}
