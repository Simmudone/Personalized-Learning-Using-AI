package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateQuestions(String content, boolean isFinal) {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        String prompt;
//        boolean isProgramming = content.toLowerCase().matches(
//                ".*(java|python|c\\+\\+|javascript|programming|coding|algorithm|data structure).*"
//        );
        String lower = content.toLowerCase();

        boolean isProgramming =
                lower.contains("java") ||
                        lower.contains("python") ||
                        lower.contains("c++") ||
                        lower.contains("javascript") ||
                        lower.contains("react") ||
                        lower.contains("node") ||
                        lower.contains("coding") ||
                        lower.contains("programming") ||
                        lower.contains("algorithm") ||
                        lower.contains("data structure");
        if (isFinal)
        {

            if(isProgramming)
            {
                // 🔥 FINAL ASSIGNMENT
                prompt = """
                You are a professional programming instructor.
                
                // Generate a FINAL EXAM for the course:
                Generate a FINAL EXAM STRICTLY for this programming course:
                
                %s
                
                Rules:
                - Generate exactly 15 MCQ questions
                - Questions must cover the ENTIRE COURSE (not UI or unrelated code)
                - Focus on core concepts, logic, and understanding
                
                - ALSO include 2 coding/problem-solving questions:
                - Must one should be simple logic and another one is medium problems
                Coding rules:
                - MUST be based on the course subject (NOT UI or React components)
                - MUST be logical problem-solving questions (like LeetCode/HackerRank)
                - MUST include:
                  - Problem statement
                  - Input format
                  - Output format
                  - Example input/output
                
                - One should be BASIC
                - One should be MEDIUM
                
                IMPORTANT:
                - Do NOT generate questions about UI, dashboards, or frontend components
                - Focus only on core programming concepts of the course
                
                Return ONLY JSON:
                {
                  "mcqs": [
                    {
                      "question": "...",
                      "options": ["A","B","C","D"],
                      "correctAnswerIndex": 0
                    }
                  ],
                  "coding": [
                    {
                      "level": "basic",
                      "question": "...",
                      "input": "...",
                      "output": "...",
                      "example": "..."
                    },
                    {
                      "level": "medium",
                      "question": "...",
                      "input": "...",
                      "output": "...",
                      "example": "..."
                    }
                  ]
                }
                """.formatted(content);
            }
            else
            {
                prompt = """
//                You are a professional programming instructor.
//                
//                Generate a FINAL EXAM for the course:
//                
//                %s
//                
//                Rules:
//                - Generate exactly 15 MCQ questions
//                - Questions must cover the ENTIRE COURSE (not UI or unrelated code)
//                - Focus on core concepts, logic, and understanding
//                
//                - 2 descriptive / case-study questions
//                - NO coding questions
//                
//                IMPORTANT:
//                - Do NOT generate questions about UI, dashboards, or frontend components
//                - Focus only on core concepts of the course
            You are an expert instructor.
            
                Generate a FINAL EXAM STRICTLY based on the following course:
            
                COURSE NAME:
                %s
            
                IMPORTANT RULES:
                - ALL questions MUST be directly related to the course topic
                - DO NOT include programming, coding, or unrelated technical concepts
                - DO NOT mix other domains
                - Questions must reflect real concepts from this subject
            
                Requirements:
                - Generate exactly 15 MCQ questions
                - Generate 2 descriptive/theory questions
                - Questions must test understanding of THIS COURSE ONLY               
                
                Return ONLY JSON:
                {
                  "mcqs": [
                    {
                      "question": "...",
                      "options": ["A","B","C","D"],
                      "correctAnswerIndex": 0
                    }
                  ],
                  "theory": [
                              {
                                "question": "..."
                              }
                  ]
                }
                """.formatted(content);
            }
        }
        else
        {
            if(isProgramming)
            {
                // 🔥 MODULE ASSIGNMENT
                prompt = """
                You are a professional teacher.
                
                Generate questions based ONLY on the following content:
                
                %s
                
                Rules:
                - Generate exactly 10 MCQ questions
                - Each MCQ must have 4 options
                - Include correctAnswerIndex
                
                - ALSO include 1 coding/problem-solving questions:
                  - Must be simple logical problems
                  - Include:
                    - Problem statement
                    - Input
                    - Output
                    - Example
                
                Return ONLY JSON:
                {
                  "mcqs": [
                    {
                      "question": "...",
                      "options": ["A","B","C","D"],
                      "correctAnswerIndex": 0
                    }
                  ],
                  "coding": [
                          {
                           "level": "basic",
                            "question": "...",
                            "input": "...",
                            "output": "...",
                            "example": "..."
                           }
                  ]
                }
                """.formatted(content);
            }
            else
            {
                // 🔥 MODULE ASSIGNMENT
                prompt = """
                You are a professional teacher.
                
                Generate questions based ONLY on the following content :
                
                %s
                
                Rules:
                - Generate exactly 10 MCQ questions
                - Each MCQ must have 4 options
                - Include correctAnswerIndex
                - 1 descriptive / case-study questions
                - NO coding questions
                
                Return ONLY JSON:
                {
                  "mcqs": [
                    {
                      "question": "...",
                      "options": ["A","B","C","D"],
                      "correctAnswerIndex": 0
                    }
                  ],
                  "theory": [
                          {"question" :"..."}
                  ]
                }
                """.formatted(content);
                }
        }
                        String requestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        { "text": "%s" }
                      ]
                    }
                  ]
                }
                """.formatted(prompt.replace("\"", "\\\""));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            System.out.println("GEMINI RESPONSE: " + response.getBody());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            return text;

        } catch (Exception e) {
            e.printStackTrace();
            return "[]";
        }
    }
}