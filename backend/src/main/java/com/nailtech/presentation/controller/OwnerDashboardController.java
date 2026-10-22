package com.nailtech.presentation.controller;

//Provides an owner-only dashboard endpoint

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner")
public class OwnerDashboardController {

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return new DashboardResponse("Owner access verified.");
    }

    public record DashboardResponse(String message) {
    }
}