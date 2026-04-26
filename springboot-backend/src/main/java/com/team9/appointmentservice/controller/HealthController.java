package com.team9.appointmentservice.controller;

import com.team9.appointmentservice.dto.HealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {
    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("ok", "Server is running");
    }
}
