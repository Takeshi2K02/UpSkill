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
}