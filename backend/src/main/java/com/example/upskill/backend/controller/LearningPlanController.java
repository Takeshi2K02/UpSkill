package com.example.upskill.backend.controller;

import com.example.upskill.backend.model.LearningPlan;
import com.example.upskill.backend.model.Topic;
import com.example.upskill.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.upskill.backend.dto.UpdateDueDateRequest;
import com.example.upskill.backend.dto.StatusUpdateRequest;

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

    // GET: Get a specific learning plan by ID
    @GetMapping("/{id}")
    public LearningPlan getLearningPlanById(@PathVariable String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learning Plan not found with id: " + id));
    }

    // PATCH: Update due date of a learning plan
     @PatchMapping("/{id}/due-date")
     public LearningPlan updateDueDate(@PathVariable String id, @RequestBody UpdateDueDateRequest request) {
         LearningPlan plan = repository.findById(id)
                 .orElseThrow(() -> new RuntimeException("Learning Plan not found with id: " + id));
     
         Instant dueDate = Instant.parse(request.getDueDate());
         plan.setDueDate(dueDate);
         plan.setUpdatedAt(Instant.now());
     
         return repository.save(plan);
     }

    @PatchMapping("/{planId}/topics/{topicIndex}")
    public LearningPlan updateTopicStatus(
            @PathVariable String planId,
            @PathVariable int topicIndex,
            @RequestBody StatusUpdateRequest request) {

        LearningPlan plan = repository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning Plan not found with id: " + planId));

        if (topicIndex < 0 || topicIndex >= plan.getTopics().size()) {
            throw new RuntimeException("Invalid topic index: " + topicIndex);
        }

        plan.getTopics().get(topicIndex).setStatus(request.getStatus());
        plan.setUpdatedAt(Instant.now());

        return repository.save(plan);
    }

    @PutMapping("/{id}")
    public LearningPlan updateLearningPlan(@PathVariable String id, @RequestBody LearningPlan updatedPlan) {
        LearningPlan existingPlan = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learning Plan not found with id: " + id));

        // Step 1: Auto-update topic statuses
        for (Topic topic : updatedPlan.getTopics()) {
            boolean textDone = topic.isTextCompleted();
            boolean allVideosDone = topic.getResources() == null || topic.getResources().isEmpty()
                    || (topic.getResourceCompletion() != null
                        && topic.getResourceCompletion().stream().allMatch(Boolean::booleanValue));

            if (textDone && allVideosDone) {
                topic.setStatus("completed");
            } else {
                topic.setStatus("incomplete");
            }
        }

        // Step 2: Recalculate progress
        double progress = 0.0;
        for (Topic topic : updatedPlan.getTopics()) {
            if (topic.isTextCompleted()) {
                progress += topic.getTextWeight();
            }
            if (topic.getResources() != null && topic.getResourceCompletion() != null) {
                for (int i = 0; i < topic.getResources().size(); i++) {
                    if (i < topic.getResourceCompletion().size() && topic.getResourceCompletion().get(i)) {
                        progress += topic.getResources().get(i).getWeight();
                    }
                }
            }
        }

        existingPlan.setTitle(updatedPlan.getTitle());
        existingPlan.setDescription(updatedPlan.getDescription());
        existingPlan.setTopics(updatedPlan.getTopics());
        existingPlan.setDueDate(updatedPlan.getDueDate());
        existingPlan.setProgress(progress);
        existingPlan.setUpdatedAt(Instant.now());

        return repository.save(existingPlan);
    }



    @DeleteMapping("/{id}")
    public void deleteLearningPlan(@PathVariable String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Learning Plan not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
    