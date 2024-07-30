package ru.sakkuratov.autotests.cucumber.steps;

import io.cucumber.java.bg.И;

public class CommonSteps {

    @И("^вывести на экран сообщение \"(.+)\"$")
    public void showMessage(String message) {
        System.out.println(message);
    }

    @И("^выполнить ожидание в течение (\\d+) секунд$")
    public void wait(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException ignore) {
        }
    }
}
