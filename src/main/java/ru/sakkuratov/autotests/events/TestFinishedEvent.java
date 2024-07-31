package ru.sakkuratov.autotests.events;

import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEvent;
import ru.sakkuratov.autotests.models.CucumberTask;

@Getter
public class TestFinishedEvent extends ApplicationEvent {

    private static final Logger logger = LoggerFactory.getLogger(TestFinishedEvent.class);
    private final String resultMessage;
    private final CucumberTask task;

    public TestFinishedEvent(CucumberTask source, String resultMessage) {
        super(source);
        this.task = source;
        this.resultMessage = resultMessage;
        logger.debug("Event created: Test finished event");
    }

}
