package ru.sakkuratov.autotests.services;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.sakkuratov.autotests.models.CucumberTask;
import ru.sakkuratov.autotests.models.TestParameters;

@Service
public class TestWatcher {

    @Autowired
    private TaskExecutor taskExecutor;
    @Autowired
    private ApplicationEventPublisher publisher;

    private final HttpHeaders headers = new HttpHeaders();

    @PostConstruct
    public void init() {
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    public ResponseEntity<CucumberTask> addTask(TestParameters testParameters) {
        CucumberTask task = new CucumberTask(testParameters, publisher);
        taskExecutor.execute(task);
        return ResponseEntity.ok().headers(headers).body(task);
    }
}
