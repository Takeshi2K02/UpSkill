package com.example.upskill.backend.model;

public class Resource {

    private String url;
    private String title;
    private String thumbnail;
    private String description;
    private double weight; // new field

    public Resource() {}

    public Resource(String url, String title, String thumbnail, String description, double weight) {
        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.description = description;
        this.weight = weight;
    }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
}