package ru.sakkuratov.autotests.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.nio.file.Paths;
import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
public class TestParameters {

    static final String BASE_FEATURES_PATH = "features";

    private String priority;
    private String glue;
    private String threads;
    private Set<String> plugin = new HashSet<>();
    private String featuresPath;
    private String owner;
    private String tags;
    private String timeout;

    public static TestParameters defaultParameters() {
        TestParameters testParameters = new TestParameters();
        testParameters.setPriority("0");
        testParameters.setThreads("1");
        testParameters.setGlue("ru.sakkuratov.autotests.cucumber");
        testParameters.addPlugin("pretty");
        testParameters.addPlugin("io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm");
        testParameters.setFeaturesPath("");
        testParameters.setOwner("DEFAULT");
        testParameters.setTags("");
        testParameters.setTimeout("10S");
        return testParameters;
    }

    @JsonIgnore
    public long getCucumberRunTimeout() {
        return Duration.parse("PT" + timeout).getSeconds();
    }

    public void addPlugin(String plugin) {
        this.plugin.add(plugin);
    }

    public void setParameters(TestParameters testParameters) {
        if (testParameters.getGlue() != null) {
            this.glue = testParameters.getGlue();
        }
        if (testParameters.getThreads() != null) {
            this.threads = testParameters.getThreads();
        }
        if (testParameters.getPlugin() != null) {
            this.plugin.addAll(testParameters.getPlugin());
        }
        if (testParameters.getFeaturesPath() != null) {
            this.featuresPath = Paths.get(BASE_FEATURES_PATH, testParameters.getFeaturesPath()).toString();
        }
        if (testParameters.getOwner() != null) {
            this.owner = testParameters.getOwner();
        }
        if (testParameters.getTags() != null) {
            this.tags = testParameters.getTags();
        }
        if (testParameters.getGlue() != null) {
            this.timeout = testParameters.getTimeout();
        }
    }
}
