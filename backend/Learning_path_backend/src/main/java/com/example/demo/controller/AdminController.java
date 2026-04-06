package com.example.demo.controller;

import com.google.firebase.auth.*;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AdminController {

    @PostMapping("/make-admin")
    public String makeAdmin(
            @RequestParam String email,
            @RequestParam String name) throws Exception {

        FirebaseAuth auth = FirebaseAuth.getInstance();

        // Get user by email
        UserRecord user = auth.getUserByEmail(email);

        // ✅ Set role claim
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "admin");

        auth.setCustomUserClaims(user.getUid(), claims);

        // ✅ Update display name
        UserRecord.UpdateRequest request =
                new UserRecord.UpdateRequest(user.getUid())
                        .setDisplayName(name);

        auth.updateUser(request);

        return "Admin role + name updated successfully!";
    }
}