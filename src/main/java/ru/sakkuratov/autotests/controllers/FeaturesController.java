package ru.sakkuratov.autotests.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.sakkuratov.autotests.models.Feature;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@RestController()
public class FeaturesController {
    private final String defaultFeaturePath = "features";

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("api/features/add")
    public ResponseEntity<Object> featureAdd(@RequestBody Feature body) {
        String filename = body.getFileName();
        String data = body.getData();

        if (filename == null || data == null) {
            return new ResponseEntity<>("{\"message\":\"Missing filename or data\"}", HttpStatus.BAD_REQUEST);
        }

        try {
            Files.writeString(Paths.get(defaultFeaturePath, filename), data, StandardCharsets.UTF_8);
            return new ResponseEntity<>("{\"message\":\"File created successfully\"}", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("{\"message\":\"Failed to create file\"}", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("api/features")
    public ResponseEntity<List<String>> getFeatures() {
        List<String> features = new ArrayList<>();
        File folder = new File(defaultFeaturePath);
        if (folder.exists()) {
            File[] featureFiles = folder.listFiles();
            if (featureFiles != null) {
                features = Stream.of(featureFiles)
                        .filter(file -> !file.isDirectory() && file.getName().endsWith(".feature"))
                        .map(File::getName).toList();
            }
        }

        return new ResponseEntity<>(features, HttpStatus.OK);
    }

    @GetMapping("api/features/{filename}")
    public ResponseEntity<Object> getFeature(@PathVariable String filename) {
        try {
            String data = Files.readString(Paths.get(defaultFeaturePath, filename));
            return new ResponseEntity<>(new Feature(filename, data), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to read feature file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("api/features/{filename}")
    public ResponseEntity<Object> featureDelete(@PathVariable String filename) {
        try {
            Files.delete(Paths.get(defaultFeaturePath, filename));
            return new ResponseEntity<>("Feature file deleted successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to delete feature file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
