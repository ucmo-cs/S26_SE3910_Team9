package com.team9.appointmentservice.controller;

import com.team9.appointmentservice.dto.BranchResponse;
import com.team9.appointmentservice.dto.TopicResponse;
import com.team9.appointmentservice.service.ReferenceDataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReferenceDataController {
    private final ReferenceDataService service;

    public ReferenceDataController(ReferenceDataService service) {
        this.service = service;
    }

    @GetMapping("/topics")
    public List<TopicResponse> getTopics() {
        return service.getTopics();
    }

    @GetMapping("/branches")
    public List<BranchResponse> getBranches() {
        return service.getBranches();
    }
}
