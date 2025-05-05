// src/main/java/com/example/upskill/backend/model/User.java
package com.example.upskill.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String role = "USER";
    private String email;
    private String avatar;
    private String bio;
    private List<String> followers = new ArrayList<>();
    private List<String> following = new ArrayList<>();
    private String password;
    
    // Constructors, getters, and setters
    public User() {}
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public List<String> getFollowers() { return followers; }
    public void setFollowers(List<String> followers) { this.followers = followers; }
    
    public List<String> getFollowing() { return following; }
    public void setFollowing(List<String> following) { this.following = following; }
    
    public int getFollowersCount() { return followers != null ? followers.size() : 0; }
    public int getFollowingCount() { return following != null ? following.size() : 0; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

}

