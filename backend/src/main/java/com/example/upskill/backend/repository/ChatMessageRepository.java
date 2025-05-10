package com.example.upskill.backend.repository;

import com.example.upskill.backend.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByUserIdOrderByTimestampAsc(String userId);

    // New method to fetch the last N messages for a user, ordered by timestamp descending
    List<ChatMessage> findTopByUserIdOrderByTimestampDesc(String userId, int limit);
}