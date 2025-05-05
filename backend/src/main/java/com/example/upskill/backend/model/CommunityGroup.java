package com.example.upskill.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "community_groups")
public class CommunityGroup {

    @Id
    private String id;

    private String name;
    private String description;

    // The user ID of the admin who created this group
    private String createdBy;

    private Instant createdAt;
    private Instant updatedAt;

    // List of user IDs who are members of this group
    private List<String> members = new ArrayList<>();

    // Constructors
    public CommunityGroup() {}

    public CommunityGroup(String name, String description, String createdBy) {
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Getters & Setters

    public String getId() {
        return id;
    }

    public void setId(String id) { 
        this.id = id; 
    }

    public String getName() {
        return name;
    }

    public void setName(String name) { 
        this.name = name; 
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) { 
        this.description = description; 
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) { 
        this.createdBy = createdBy; 
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

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) { 
        this.members = members; 
    }

    public void addMember(String userId) {
        if (!members.contains(userId)) {
            members.add(userId);
            this.updatedAt = Instant.now();
        }
    }

    public void removeMember(String userId) {
        if (members.remove(userId)) {
            this.updatedAt = Instant.now();
        }
    }
}