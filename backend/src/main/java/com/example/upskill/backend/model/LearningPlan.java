package com.example.upskill.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "learningPlans")
public class LearningPlan {

    @Id
    private String id;

    private String userId;
    private String title;
    private String description;
    private List<Topic> topics;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant dueDate;

    public LearningPlan() {}

    public LearningPlan(String id, String userId, String title, String description, List<Topic> topics, Instant createdAt, Instant updatedAt, Instant dueDate) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.topics = topics;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.dueDate = dueDate;
    }    

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Topic> getTopics() { return topics; }
    public void setTopics(List<Topic> topics) { this.topics = topics; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Instant getDueDate() { return dueDate; }
    public void setDueDate(Instant dueDate) { this.dueDate = dueDate; }
}