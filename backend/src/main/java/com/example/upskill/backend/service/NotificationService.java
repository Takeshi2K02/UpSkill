package com.example.upskill.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.upskill.backend.model.Notification;
import com.example.upskill.backend.repository.NotificationRepository;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(String userId, String actionBy, String actionType, String postId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setActionBy(actionBy);
        notification.setActionType(actionType);
        notification.setPostId(postId);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false);
    }

    public List<Notification> getAllNotifications(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    public void markAsRead(String userId) {
        List <Notification> notifications = notificationRepository.findByUserIdAndIsRead(userId, false);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}