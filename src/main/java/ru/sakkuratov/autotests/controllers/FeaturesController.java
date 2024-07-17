package ru.sakkuratov.autotests.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.sakkuratov.autotests.models.Feature;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@RestController
public class FeaturesController {
    private final String defaultFeaturePath = "features";

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("features/add")
    public ResponseEntity<Object> taskAdd(@RequestBody Feature body) {
        String filename = body.getFilename();
        String data = body.getData();

        if (filename == null || data == null) {
            return new ResponseEntity<>("Missing filename or data", HttpStatus.BAD_REQUEST);
        }

        try {
            Files.write(Paths.get(defaultFeaturePath, filename + ".feature"), data.getBytes());
            return new ResponseEntity<>("File created successfully", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to create file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("features")
    public ResponseEntity<List<String>> getStatus() {
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

    @GetMapping("feature/{filename}")
    public ResponseEntity<Object> getStatus(@PathVariable String filename) {
        try {
            String data = new String(Files.readAllBytes(Paths.get(defaultFeaturePath, filename)));
            return new ResponseEntity<>(new Feature(filename, data), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to read feature file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("features/{filename}")
    public ResponseEntity<Object> taskDelete(@PathVariable String filename) {
        try {
            Files.delete(Paths.get(defaultFeaturePath, filename));
            return new ResponseEntity<>("Feature file deleted successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to delete feature file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
