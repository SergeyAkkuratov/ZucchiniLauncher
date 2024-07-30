package ru.sakkuratov.autotests.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    @GetMapping(value = "/api/username")
    public Map<String, String> currentUserName(Authentication authentication) {
        System.out.println(authentication.toString());
        return Map.of("username", authentication.getName(), "role", authentication.getAuthorities().toString());
    }
}
