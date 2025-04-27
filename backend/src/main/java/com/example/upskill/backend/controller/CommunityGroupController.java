package com.example.upskill.backend.controller;

import com.example.upskill.backend.dto.MembershipRequest;
import com.example.upskill.backend.model.CommunityGroup;
import com.example.upskill.backend.repository.CommunityGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin
public class CommunityGroupController {

    @Autowired
    private CommunityGroupRepository repository;

    /** Create a new community group and auto-add creator as member */
    @PostMapping
    public CommunityGroup createGroup(@RequestBody CommunityGroup group) {
        group.setCreatedAt(Instant.now());
        group.setUpdatedAt(Instant.now());
        group.addMember(group.getCreatedBy());    // ← auto-join creator
        return repository.save(group);
    }

    @GetMapping
    public List<CommunityGroup> getAllGroups() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public CommunityGroup getGroupById(@PathVariable String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
    }

    @GetMapping("/admin/{adminId}")
    public List<CommunityGroup> getGroupsByAdmin(@PathVariable String adminId) {
        return repository.findByCreatedBy(adminId);
    }

    @GetMapping("/user/{userId}")
    public List<CommunityGroup> getGroupsByMember(@PathVariable String userId) {
        return repository.findByMembersContaining(userId);
    }

    @PutMapping("/{id}")
    public CommunityGroup updateGroup(
            @PathVariable String id,
            @RequestBody CommunityGroup updated
    ) {
        CommunityGroup existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setUpdatedAt(Instant.now());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Group not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @PostMapping("/{id}/join")
    public CommunityGroup joinGroup(
            @PathVariable String id,
            @RequestBody MembershipRequest request
    ) {
        CommunityGroup group = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));

        group.addMember(request.getUserId());
        return repository.save(group);
    }

    @PostMapping("/{id}/leave")
    public CommunityGroup leaveGroup(
            @PathVariable String id,
            @RequestBody MembershipRequest request
    ) {
        CommunityGroup group = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));

        group.removeMember(request.getUserId());
        return repository.save(group);
    }
}