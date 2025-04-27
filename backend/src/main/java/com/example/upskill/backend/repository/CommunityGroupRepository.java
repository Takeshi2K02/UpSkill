package com.example.upskill.backend.repository;

import com.example.upskill.backend.model.CommunityGroup;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommunityGroupRepository extends MongoRepository<CommunityGroup, String> {

    /**
     * Find all groups created by a given admin user.
     */
    List<CommunityGroup> findByCreatedBy(String createdBy);

    /**
     * Find all groups that a given user is a member of.
     */
    List<CommunityGroup> findByMembersContaining(String userId);
}