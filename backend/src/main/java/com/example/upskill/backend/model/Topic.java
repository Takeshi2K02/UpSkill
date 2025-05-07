package com.example.upskill.backend.model;

import java.util.List;

public class Topic {

    private String name;
    private String textContent;
    private List<Resource> resources;
    private double weight;
    private double textWeight;
    private boolean textCompleted;
    private List<Boolean> resourceCompletion;
    private String status;

    public Topic() {}

    public Topic(String name, String textContent, List<Resource> resources, double weight, double textWeight,
                 boolean textCompleted, List<Boolean> resourceCompletion, String status) {
        this.name = name;
        this.textContent = textContent;
        this.resources = resources;
        this.weight = weight;
        this.textWeight = textWeight;
        this.textCompleted = textCompleted;
        this.resourceCompletion = resourceCompletion;
        this.status = status;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public List<Resource> getResources() { return resources; }
    public void setResources(List<Resource> resources) { this.resources = resources; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public double getTextWeight() { return textWeight; }
    public void setTextWeight(double textWeight) { this.textWeight = textWeight; }

    public boolean isTextCompleted() { return textCompleted; }
    public void setTextCompleted(boolean textCompleted) { this.textCompleted = textCompleted; }

    public List<Boolean> getResourceCompletion() { return resourceCompletion; }
    public void setResourceCompletion(List<Boolean> resourceCompletion) { this.resourceCompletion = resourceCompletion; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}