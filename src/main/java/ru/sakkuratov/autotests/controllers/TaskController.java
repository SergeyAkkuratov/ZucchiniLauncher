package ru.sakkuratov.autotests.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sakkuratov.autotests.models.TestParameters;
import ru.sakkuratov.autotests.services.TestWatcher;

import static ru.sakkuratov.autotests.helpers.CommonHelpers.getStackTrace;

@RestController
public class TaskController {
    private static final HttpHeaders headers = new HttpHeaders();

    static {
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    @Autowired
    private TestWatcher testWatcher;

    @PostMapping("api/tasks/add")
    public ResponseEntity taskAdd(@RequestBody String body) {
        try {
            TestParameters parameters = new ObjectMapper().readValue(body, TestParameters.class);
            return testWatcher.addTask(parameters);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Test didn't launch: " + getStackTrace(ex));
        }
    }

    @GetMapping("api/tasks")
    public ResponseEntity<Object> getStatus() {
        Object result = testWatcher.getStatus();
        return ResponseEntity.ok().headers(headers).body(result);
    }

    @GetMapping("api/tasks/{id}")
    public ResponseEntity<Object> getStatus(@PathVariable String id) {
        Object result = testWatcher.getStatus(id);
        return ResponseEntity.ok().headers(headers).body(result);
    }

    @DeleteMapping("api/tasks/{id}")
    public ResponseEntity<Object> removeTask(@PathVariable String id) {
        try {
            testWatcher.removeTask(id);
            return ResponseEntity.ok().headers(headers).body("Task removed");
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Task wasn't removed: " + getStackTrace(ex));
        }
    }
}
