
package com.example.demo.controller;

import com.example.demo.service.GeminiService;
import com.example.demo.service.AssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/assignment")
@CrossOrigin(origins = "http://localhost:8081")
public class AssignmentController {

    private final GeminiService geminiService;
    private final AssignmentService assignmentService;

    // ✅ Constructor Injection
    public AssignmentController(GeminiService geminiService,
                                AssignmentService assignmentService) {
        this.geminiService = geminiService;
        this.assignmentService = assignmentService;
    }

    // ✅ Generate AI Assignment
    @PostMapping("/generate")
    public Map<String, Object> generateAssignment(
            @RequestBody Map<String, String> request) {

        String moduleContent = request.get("moduleContent");
        String userId = request.getOrDefault("userId", "anonymous");
        boolean isFinal = Boolean.parseBoolean(
                request.getOrDefault("isFinal", "false")
        );

        // 🔥 Call Gemini API
//        String questions = geminiService.generateQuestions(moduleContent);
        String questions = geminiService.generateQuestions(moduleContent, isFinal);
        // 🔥 Save to Firebase
        assignmentService.saveAssignment(userId, moduleContent, questions);

        return Map.of(
                "userId", userId,
                "questions", questions
        );
    }

    // ✅ Submit Assignment
    @PostMapping("/submit")
    public Map<String, Object> submitAssignment(
            @RequestBody Map<String, Object> request) {

        int score = (int) request.get("score");

        boolean passed = score >= 75;

        return Map.of(
                "score", score,
                "passed", passed
        );
    }
}