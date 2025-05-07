package com.example.upskill.backend.controller;

import com.example.upskill.backend.model.User;
import com.example.upskill.backend.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class FacebookAuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/facebook")
    public ResponseEntity<?> handleFacebookLogin(@RequestBody Map<String, String> payload) {
        String accessToken = payload.get("accessToken");

        String url = "https://graph.facebook.com/me?fields=id,name&access_token=" + accessToken;

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> fbUser = restTemplate.getForObject(url, Map.class);

            // Extract values
            String id = (String) fbUser.get("id");
            String name = (String) fbUser.get("name");

            // Check if user already exists
            Optional<User> existingUser = userRepository.findById(id);
            User user = existingUser.orElseGet(User::new);

            user.setId(id);
            user.setName(name);

            // If new user, set default role
            if (user.getRole() == null) {
                user.setRole("USER");
            }

            userRepository.save(user);

            // Generate JWT with role
            String jwt = Jwts.builder()
                    .setSubject(id)
                    .claim("name", name)
                    .claim("role", user.getRole()) // ➡️ include role in token
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                    .signWith(SignatureAlgorithm.HS256, "adfc105ad1564b1fb3409fea30fe4dac")
                    .compact();

            return ResponseEntity.ok(Map.of(
                    "message", "Facebook login verified",
                    "token", jwt,
                    "facebookAccessToken", accessToken,
                    "user", Map.of(
                            "id", id,
                            "name", name,
                            "role", user.getRole()
                    )
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid Facebook token"));
        }
    }
}