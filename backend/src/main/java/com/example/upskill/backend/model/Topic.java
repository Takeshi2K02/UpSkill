package com.example.upskill.backend.model;

import java.util.List;

public class Topic {

    private String name;
    private String textContent;
    private List<Resource> resources;
    private double weight;

    public Topic() {}

    public Topic(String name, String textContent, List<Resource> resources, double weight) {
        this.name = name;
        this.textContent = textContent;
        this.resources = resources;
        this.weight = weight;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public List<Resource> getResources() { return resources; }
    public void setResources(List<Resource> resources) { this.resources = resources; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
}