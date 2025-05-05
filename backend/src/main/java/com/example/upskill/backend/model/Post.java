package com.example.upskill.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;

    // The author of this post
    private String userId;

    // If this post belongs to a community group, its ID; otherwise null
    private String groupId;

    private String content;
    private Instant createdAt;
    private Instant updatedAt;

    private List<String> likes = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();
    private List<String> attachments = new ArrayList<>();

    // Constructors

    /** General purpose constructor (e.g. normal feed) */
    public Post() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    /** Normal post constructor */
    public Post(String userId, String content) {
        this();
        this.userId = userId;
        this.content = content;
    }

    /** Group‐post constructor */
    public Post(String userId, String groupId, String content) {
        this(userId, content);
        this.groupId = groupId;
    }

    // Getters & Setters

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

    public String getGroupId() {
        return groupId;
    }
    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
        this.updatedAt = Instant.now();
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<String> getLikes() {
        return likes;
    }
    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public List<Comment> getComments() {
        return comments;
    }
    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<String> getAttachments() {
        return attachments;
    }
    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
}
