package com.example.upskill.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dxvgj4i9t");
        config.put("api_key", "323683446836626");
        config.put("api_secret", "BGZm2v3WHRajz0W6miBGfHsnZa8");
        return new Cloudinary(config);
    }
}