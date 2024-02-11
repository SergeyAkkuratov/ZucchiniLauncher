package ru.sakkuratov.autotests.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sakkuratov.autotests.services.StabSystemTaskService;
import ru.sakkuratov.autotests.services.StabTestWatcherService;

import java.util.Map;

@RestController
public class TaskController {
    @Autowired
    private StabTestWatcherService testWatcher;
    @Autowired
    private StabSystemTaskService systemTaskService;

    private static final HttpHeaders headers = new HttpHeaders();

    static {
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    @PostMapping("task/add")
    public ResponseEntity<Object> taskAdd(@RequestBody String body) {
        Map<String, String> responseBody = testWatcher.addTask(body);
        return ResponseEntity.accepted().headers(headers).body(responseBody);
    }

    @GetMapping("tasks")
    public ResponseEntity<Object> getStatus() {
        Object result = testWatcher.getStatus(null);
        return ResponseEntity.ok().headers(headers).body(result);
    }

    @GetMapping("tasks/{id}")
    public ResponseEntity<Object> getStatus(@PathVariable String id) {
        Object result = testWatcher.getStatus(id);
        return ResponseEntity.ok().headers(headers).body(result);
    }
}
