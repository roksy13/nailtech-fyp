package com.nailtech;

//Provides a public health-check endpoint for checking backend connectivity

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public String health() {
        return "NailTech backend is running!";
    }
}
