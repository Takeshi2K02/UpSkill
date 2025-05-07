package com.example.upskill.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.upskill.backend.model.Notification;
import com.example.upskill.backend.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getNotifications(@RequestParam String userId) {
        return notificationService.getAllNotifications(userId);
    }

    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications(@RequestParam String userId) {
        return notificationService.getUnreadNotifications(userId);
    }

    @PostMapping("/mark-as-read")
    public void markAsRead(@RequestParam String userId) {
        notificationService.markAsRead(userId);
    }
}