package com.example.demo.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AssignmentService {

    public void saveAssignment(String userId, String topic, String questions) {

        Firestore db = FirestoreClient.getFirestore();

        Map<String, Object> data = new HashMap<>();
        data.put("userId", userId);
        data.put("topic", topic);
        data.put("questions", questions);
        data.put("score", 0);

        db.collection("assignments").add(data);
    }
}