package ru.sakkuratov.autotests.events;

import org.springframework.context.ApplicationEvent;

public class StartCleanEvent extends ApplicationEvent {
    public StartCleanEvent(Object source) {
        super(source);
    }
}
