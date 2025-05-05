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

    private final String JWT_SECRET = "adfc105ad1564b1fb3409fea30fe4dac";

    @PostMapping("/facebook")
    public ResponseEntity<?> handleFacebookLogin(@RequestBody Map<String, String> payload) {
        String accessToken = payload.get("accessToken");
        String url = "https://graph.facebook.com/me?fields=id,name&access_token=" + accessToken;

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> fbUser = restTemplate.getForObject(url, Map.class);

            String id = (String) fbUser.get("id");
            String name = (String) fbUser.get("name");

            Optional<User> existingUser = userRepository.findById(id);
            User user = existingUser.orElseGet(User::new);

            user.setId(id);
            user.setName(name);
            if (user.getRole() == null) user.setRole("USER");

            userRepository.save(user);

            String jwt = generateToken(id, name, user.getRole());

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

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing username or password"));
        }

        if (userRepository.findById(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already exists"));
        }

        User user = new User();
        user.setId(username); // Set username as ID
        user.setName(username);
        user.setPassword(password);
        user.setRole("USER");
        user.setAvatar("http://localhost:8080/images/default-avatar.png");

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        Optional<User> userOpt = userRepository.findById(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username"));
        }

        User user = userOpt.get();
        if (!password.equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid password"));
        }

        String jwt = generateToken(username, user.getName(), user.getRole());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "token", jwt,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "role", user.getRole()
                )
        ));
    }

    private String generateToken(String id, String name, String role) {
        return Jwts.builder()
                .setSubject(id)
                .claim("name", name)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS256, JWT_SECRET)
                .compact();
    }
}