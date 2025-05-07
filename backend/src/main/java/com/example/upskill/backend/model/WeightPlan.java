package com.example.upskill.backend.model;

import java.util.List;

public class WeightPlan {
    private String title;
    private List<WeightedTopic> topics;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<WeightedTopic> getTopics() { return topics; }
    public void setTopics(List<WeightedTopic> topics) { this.topics = topics; }

    public static class WeightedTopic {
        private String name;
        private double weight;
        private double textWeight;
        private List<Double> resourceWeights;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public double getWeight() { return weight; }
        public void setWeight(double weight) { this.weight = weight; }

        public double getTextWeight() { return textWeight; }
        public void setTextWeight(double textWeight) { this.textWeight = textWeight; }

        public List<Double> getResourceWeights() { return resourceWeights; }
        public void setResourceWeights(List<Double> resourceWeights) { this.resourceWeights = resourceWeights; }
    }
}
