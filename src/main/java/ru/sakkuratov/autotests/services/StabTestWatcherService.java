package ru.sakkuratov.autotests.services;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StabTestWatcherService {
    private final List<Map<String, String>> tests = new ArrayList<>();
    public Map<String, String> addTask(String body) {
        String id = UUID.randomUUID().toString();
        Map<String, String> result = new HashMap<>();
        result.put("id", id);
        result.put("request", body);
        tests.add(result);
        return result;
    }

    public Object getStatus(String id) {
        if(null == id) return tests;
        return tests.stream().filter(test -> test.get("id").equals(id)).findAny().orElse(null);
    }

    public void removeTask(String id) {
        tests.removeIf(test -> test.get("id").equals(id));
    }
}
