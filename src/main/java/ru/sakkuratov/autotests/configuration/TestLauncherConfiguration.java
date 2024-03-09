package ru.sakkuratov.autotests.configuration;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ApplicationEventMulticaster;
import org.springframework.context.event.SimpleApplicationEventMulticaster;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import ru.sakkuratov.autotests.exception.CustomAsyncExceptionHandler;

@Configuration
public class TestLauncherConfiguration implements AsyncConfigurer {
    @Value("${spring.async.core-pool-size:1}")
    private Integer corePoolSize;
    @Value("${spring.async.max-pool-size:3}")
    private Integer maxCorePoolSize;
    @Value("${ spring.async.queue-capacity:100}")
    private Integer queueCapacity;

    @Bean(name = "TaskExecutor")
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxCorePoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setThreadNamePrefix("TaskExecutor::");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.initialize();
        return executor;
    }
    @Bean
    public ApplicationEventMulticaster simpleApplicationEventMulticaster() {
        SimpleApplicationEventMulticaster eventMulticaster = new SimpleApplicationEventMulticaster();
        SimpleAsyncTaskExecutor asyncTaskExecutor = new SimpleAsyncTaskExecutor();
        asyncTaskExecutor.setThreadNamePrefix("EventProceed::");
        eventMulticaster.setTaskExecutor(asyncTaskExecutor);
        return eventMulticaster;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new CustomAsyncExceptionHandler();
    }
}
