package ru.sakkuratov.autotests.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sakkuratov.autotests.models.TestParameters;
import ru.sakkuratov.autotests.services.StabSystemTaskService;
import ru.sakkuratov.autotests.services.StabTestWatcherService;
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
    @Autowired
    private StabTestWatcherService stabTestWatcher;
    @Autowired
    private StabSystemTaskService systemTaskService;

    @PostMapping("task/add")
    public ResponseEntity taskAdd(@RequestBody String body) {
        try {
            TestParameters parameters = new ObjectMapper().readValue(body, TestParameters.class);
            return testWatcher.addTask(parameters);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Test didn't launch: " + getStackTrace(ex));
        }
    }

    @GetMapping("tasks")
    public ResponseEntity<Object> getStatus() {
        Object result = stabTestWatcher.getStatus(null);
        return ResponseEntity.ok().headers(headers).body(result);
    }

    @GetMapping("tasks/{id}")
    public ResponseEntity<Object> getStatus(@PathVariable String id) {
        Object result = stabTestWatcher.getStatus(id);
        return ResponseEntity.ok().headers(headers).body(result);
    }
}
