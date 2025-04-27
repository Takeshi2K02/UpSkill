package com.example.upskill.backend.model;

import java.time.Instant;

public class Comment {
    private String id;
    private String userId;
    private String userName;
    private String content;
    private Instant createdAt;
    

    // Constructors
    public Comment() {
        this.createdAt = Instant.now();
    }

    public Comment(String userId, String content) {
        this();
        this.id = java.util.UUID.randomUUID().toString();
        this.userId = userId;
        this.content = content;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}