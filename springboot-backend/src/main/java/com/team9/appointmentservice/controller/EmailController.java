package com.team9.appointmentservice.controller;

import com.team9.appointmentservice.dto.EmailRequest;
import com.team9.appointmentservice.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(
                    request.getTo(),
                    request.getSubject(),
                    request.getBody()
            );
            return ResponseEntity.ok("Email sent");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }
}