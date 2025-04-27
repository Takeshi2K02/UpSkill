package com.example.upskill.backend.dto;

public class MembershipRequest {

    private String userId;

    // Default constructor (required for deserialization)
    public MembershipRequest() {}

    // Convenience constructor
    public MembershipRequest(String userId) {
        this.userId = userId;
    }

    // Getter
    public String getUserId() {
        return userId;
    }

    // Setter
    public void setUserId(String userId) {
        this.userId = userId;
    }
}