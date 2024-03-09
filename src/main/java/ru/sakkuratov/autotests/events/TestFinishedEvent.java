package ru.sakkuratov.autotests.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEvent;
import ru.sakkuratov.autotests.models.CucumberTask;

public class TestFinishedEvent extends ApplicationEvent {

    private static final Logger logger = LoggerFactory.getLogger(TestFinishedEvent.class);
    private final String resultMessage;

    public TestFinishedEvent(CucumberTask source, String resultMessage) {
        super(source);
        this.resultMessage = resultMessage;
        logger.debug("Event created: Test finished event");
    }

    public String getResultMessage() {
        return this.resultMessage;
    }
}
