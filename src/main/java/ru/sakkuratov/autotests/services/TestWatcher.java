package ru.sakkuratov.autotests.services;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.sakkuratov.autotests.events.TestFinishedEvent;
import ru.sakkuratov.autotests.models.CucumberTask;
import ru.sakkuratov.autotests.models.TestParameters;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class TestWatcher {

    private final HttpHeaders headers = new HttpHeaders();
    private final ConcurrentLinkedDeque<CucumberTask> runningTasks = new ConcurrentLinkedDeque<>();
    private final ConcurrentLinkedDeque<CucumberTask> queuedTasks = new ConcurrentLinkedDeque<>();
    @Value("${maximum.running.tests:3}")
    private Integer maximumRunningTests;
    @Autowired
    private TaskExecutor taskExecutor;
    @Autowired
    private ApplicationEventPublisher publisher;

    @PostConstruct
    public void init() {
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    public ResponseEntity<CucumberTask> addTask(TestParameters testParameters) {
        CucumberTask task = new CucumberTask(testParameters, publisher);
        if (runningTasks.size() < maximumRunningTests) {
            runningTasks.add(task);
            taskExecutor.execute(task);
        } else {
            queuedTasks.add(task);
        }

        return ResponseEntity.ok().headers(headers).body(task);
    }

    @EventListener(TestFinishedEvent.class)
    public void onTestFinished(TestFinishedEvent event) {
        CucumberTask task = event.getTask();
        runningTasks.remove(task);
        if (!queuedTasks.isEmpty() && runningTasks.size() < maximumRunningTests) {
            CucumberTask nextTask = queuedTasks.poll();
            runningTasks.add(nextTask);
            taskExecutor.execute(nextTask);
        }
    }

    public Map<String, Object> getStatus() {
        Map<String, Object> tasks = new HashMap<>();
        tasks.put("running", runningTasks);
        tasks.put("queued", queuedTasks);
        return tasks;
    }

    public Map<String, Object> getStatus(String id) {
        Map<String, Object> result = new HashMap<>();
        Optional<CucumberTask> task = runningTasks.stream().filter(t -> t.getId().equals(id)).findFirst();
        if (task.isPresent()) {
            result.put("task", task.get());
            result.put("status", "running");
        } else {
            task = queuedTasks.stream().filter(t -> t.getId().equals(id)).findFirst();
            if (task.isPresent()) {
                result.put("task", task.get());
                result.put("status", "queued");
            } else {
                result.put("status", "not found");
            }
        }
        return result;
    }

    public void removeTask(String id) {
        queuedTasks.removeIf(t -> t.getId().equals(id));
    }
}
