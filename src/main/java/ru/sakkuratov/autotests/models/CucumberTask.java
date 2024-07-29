package ru.sakkuratov.autotests.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.core.cli.Main;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import ru.sakkuratov.autotests.events.TestFinishedEvent;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static ru.sakkuratov.autotests.helpers.CommonHelpers.getStackTrace;

@Getter
@Setter
public class CucumberTask implements Runnable {

    private static final Logger logger = LoggerFactory.getLogger(CucumberTask.class);
    private final Integer id;
    private final String startTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"));
    private final TestParameters parameters = TestParameters.defaultParameters();

    @JsonIgnore
    private final ApplicationEventPublisher publisher;

    public CucumberTask(Integer id, TestParameters parameters, ApplicationEventPublisher publisher) {
        this.id = id;
        this.publisher = publisher;
        this.parameters.setParameters(parameters);
    }

    @Override
    public void run() {
        logger.info("Test has started.");
        String resultMessage = "Tests finished successful.";
        int exitStatus = Main.run(getCucumberArgs());
        logger.info("Test has finished.");
        if (exitStatus != 0) resultMessage = "Test finished with errors.";
        publisher.publishEvent(new TestFinishedEvent(this, resultMessage));
    }

    private String[] getCucumberArgs() {
        List<String> args = new ArrayList<>();
        args.add("--threads");
        args.add(parameters.getThreads());
        args.add("--glue");
        args.add(parameters.getGlue());
        parameters.getPlugin().forEach(plugin -> {
            args.add("--plugin");
            args.add(plugin);
        });
        args.add("--tags");
        args.add(parameters.getTags());
        args.add(parameters.getFeaturesPath());
        return args.toArray(new String[0]);
    }

    @Override
    public String toString() {
        try {
            return new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(this);
        } catch (JsonProcessingException e) {
            logger.error("Couldn't parse CucumberTask to JSON. Error: {}", getStackTrace(e));
            return String.valueOf(this.id);
        }
    }

    public Integer getPriority() {
        return Integer.valueOf(this.parameters.getPriority());
    }
}
