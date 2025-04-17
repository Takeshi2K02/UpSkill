package com.example.upskill.backend.controller;

import com.example.upskill.backend.model.LearningPlan;
import com.example.upskill.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository repository;

    // POST: Create a new learning plan
    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        plan.setCreatedAt(Instant.now());
        plan.setUpdatedAt(Instant.now());
        return repository.save(plan);
    }

    // GET: Get learning plans by user ID
    @GetMapping
    public List<LearningPlan> getPlansByUserId(@RequestParam String userId) {
        return repository.findByUserId(userId);
    }
}