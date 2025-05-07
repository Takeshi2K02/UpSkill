package com.example.upskill.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId; // User to notify
    private String actionBy; // User who performed the action
    private String actionType; // "like" or "comment"
    private String postId;
    private LocalDateTime timestamp;
    private boolean isRead;

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getActionBy() {
        return actionBy;
    }
    public void setActionBy(String actionBy) {
        this.actionBy = actionBy;
    }
    public String getActionType() {
        return actionType;
    }
    public void setActionType(String actionType) {
        this.actionType = actionType;
    }
    public String getPostId() {
        return postId;
    }
    public void setPostId(String postId) {
        this.postId = postId;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    public boolean isRead() {
        return isRead;
    }
    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }
    
}
