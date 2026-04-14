//package com.example.demo.controller;
//
//import com.google.firebase.auth.*;
//import org.springframework.web.bind.annotation.*;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "*")
//public class AdminController {
//
//    @PostMapping("/make-admin")
//    public String makeAdmin(
//            @RequestParam String email,
//            @RequestParam String name) throws Exception {
//
//        FirebaseAuth auth = FirebaseAuth.getInstance();
//
//        // Get user by email
//        UserRecord user = auth.getUserByEmail(email);
//
//        // ✅ Set role claim
//        Map<String, Object> claims = new HashMap<>();
//        claims.put("role", "admin");
//
//        auth.setCustomUserClaims(user.getUid(), claims);
//
//        // ✅ Update display name
//        UserRecord.UpdateRequest request =
//                new UserRecord.UpdateRequest(user.getUid())
//                        .setDisplayName(name);
//
//        auth.updateUser(request);
//
//        return "Admin role + name updated successfully!";
//    }
//}

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
    public String makeAdmin(@RequestBody Map<String, String> request) throws Exception {

        String email = request.get("email");
        String name = request.get("name");

        FirebaseAuth auth = FirebaseAuth.getInstance();
        UserRecord user = auth.getUserByEmail(email);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "admin");

        auth.setCustomUserClaims(user.getUid(), claims);

        UserRecord.UpdateRequest updateRequest =
                new UserRecord.UpdateRequest(user.getUid())
                        .setDisplayName(name);

        auth.updateUser(updateRequest);

        return "Admin role assigned!";
    }
    @PostMapping("/remove-admin")
    public String removeAdmin(@RequestBody Map<String, String> request) throws Exception {

        String email = request.get("email");

        FirebaseAuth auth = FirebaseAuth.getInstance();
        UserRecord user = auth.getUserByEmail(email);

        // 🔥 Remove admin role (set as student or empty)
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "student"); // or remove role completely

        auth.setCustomUserClaims(user.getUid(), claims);

        return "Admin role removed successfully!";
    }
    @PostMapping("/delete-user")
    public String deleteUser(@RequestBody Map<String, String> request) throws Exception {

        String email = request.get("email");

        FirebaseAuth auth = FirebaseAuth.getInstance();

        try {
            // 🔍 Get user by email
            UserRecord user = auth.getUserByEmail(email);

            // 🗑️ Delete user
            auth.deleteUser(user.getUid());

            return "User deleted successfully!";

        } catch (FirebaseAuthException e) {
            return "Error: User not found or already deleted!";
        }
    }
}