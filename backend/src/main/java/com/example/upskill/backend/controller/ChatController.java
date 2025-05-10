package com.example.upskill.backend.controller;

import com.example.upskill.backend.model.ChatMessage;
import com.example.upskill.backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatRepo;

    @GetMapping("/{userId}")
    public List<ChatMessage> getUserMessages(@PathVariable String userId) {
        return chatRepo.findByUserIdOrderByTimestampAsc(userId);
    }

    @PostMapping
    public ChatMessage saveMessage(@RequestBody ChatMessage message) {
        return chatRepo.save(message);
    }

    // New endpoint to fetch the last N messages for context
    @GetMapping("/{userId}/recent/{limit}")
    public List<ChatMessage> getRecentMessages(@PathVariable String userId, @PathVariable int limit) {
        return chatRepo.findTopByUserIdOrderByTimestampDesc(userId, limit);
    }
}