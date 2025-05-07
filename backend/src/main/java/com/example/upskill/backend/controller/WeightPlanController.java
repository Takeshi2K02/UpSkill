package com.example.upskill.backend.controller;

import com.example.upskill.backend.model.WeightPlan;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weights")
@CrossOrigin
public class WeightPlanController {

    @PostMapping
    public String receiveWeights(@RequestBody WeightPlan plan) {
        System.out.println("Received Plan: " + plan.getTitle());
        for (WeightPlan.WeightedTopic t : plan.getTopics()) {
            System.out.println("- " + t.getName() + ": " + t.getWeight() +
                               " | Text: " + t.getTextWeight() +
                               " | Videos: " + t.getResourceWeights());
        }
        return "Received";
    }
}