package com.team9.appointmentservice.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team9.appointmentservice.dto.ApiResponse;
import com.team9.appointmentservice.dto.AppointmentCreateRequest;
import com.team9.appointmentservice.dto.AppointmentEmailRequest;
import com.team9.appointmentservice.dto.AppointmentResponse;
import com.team9.appointmentservice.entity.UserAccountEntity;
import com.team9.appointmentservice.service.AppointmentService;
import com.team9.appointmentservice.service.EmailService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appointments")
@Validated
public class AppointmentController {
    private static final Logger log = LoggerFactory.getLogger(AppointmentController.class);

    private final AppointmentService appointmentService;
    private final EmailService emailService;

    public AppointmentController(AppointmentService appointmentService, EmailService emailService) {
        this.appointmentService = appointmentService;
        this.emailService = emailService;
    }

    @GetMapping
    public List<AppointmentResponse> list(@RequestParam(value = "email", required = false) String email) {
        UserAccountEntity currentUser = currentUser();

        if (email != null && !email.isBlank()) {
            if (!currentUser.getEmail().equalsIgnoreCase(email)) {
                return List.of();
            }
            return appointmentService.listByEmail(email);
        }

        return appointmentService.listByUserId(currentUser.getId());
    }

    @GetMapping("/{id}")
    public AppointmentResponse getById(@PathVariable String id) {
        return appointmentService.getById(id);
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(@Valid @RequestBody AppointmentCreateRequest request) {
        UserAccountEntity currentUser = currentUser();
        AppointmentResponse response = appointmentService.create(request, currentUser);

        try {
            String body = String.format(
                    "Dear %s,%n%nYour appointment has been successfully scheduled. Here are the details:%n%nConfirmation Number: %s%nTopic: %s%nBranch: %s%nDate: %s%nTime: %s%n%nThank you,%nCommerce Bank",
                    request.customerName(),
                    response.confirmationNumber(),
                    request.topicName(),
                    request.branchName(),
                    request.dateLabel(),
                    request.timeLabel()
            );
            emailService.sendEmail(currentUser.getEmail(), "Appointment Confirmation - " + response.confirmationNumber(), body);
        } catch (Exception exception) {
            log.warn("Failed to send appointment confirmation email to {}: {}", currentUser.getEmail(), exception.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/send-confirmation")
    public ApiResponse sendConfirmation(@Valid @RequestBody AppointmentEmailRequest request) {
        try {
            String body = String.format(
                    "Dear %s,%n%nYour appointment is confirmed with the following details:%n%nTopic: %s%nBranch: %s%nDate: %s%nTime: %s%nConfirmation Number: %s%n%nThank you,%nCommerce Bank",
                    request.customerName(),
                    request.topicName(),
                    request.branchName(),
                    request.dateLabel(),
                    request.timeLabel(),
                    request.confirmationNumber()
            );
            emailService.sendEmail(request.customerEmail(), "Appointment Confirmation - " + request.confirmationNumber(), body);
            return ApiResponse.ok("Appointment confirmation email sent.");
        } catch (Exception exception) {
            log.error("Failed to send confirmation email to {}", request.customerEmail(), exception);
            return ApiResponse.error("Failed to send confirmation email.", exception.getMessage());
        }
    }

    @PostMapping("/send-reminder")
    public ApiResponse sendReminder(@Valid @RequestBody AppointmentEmailRequest request) {
        try {
            String body = String.format(
                    "Dear %s,%n%nThis is a reminder for your upcoming appointment:%n%nTopic: %s%nBranch: %s%nDate: %s%nTime: %s%nConfirmation Number: %s%n%nWe look forward to seeing you.%nCommerce Bank",
                    request.customerName(),
                    request.topicName(),
                    request.branchName(),
                    request.dateLabel(),
                    request.timeLabel(),
                    request.confirmationNumber()
            );
            emailService.sendEmail(request.customerEmail(), "Appointment Reminder - " + request.confirmationNumber(), body);
            return ApiResponse.ok("Appointment reminder email sent.");
        } catch (Exception exception) {
            log.error("Failed to send reminder email to {}", request.customerEmail(), exception);
            return ApiResponse.error("Failed to send reminder email.", exception.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable String id) {
        appointmentService.deleteById(id);
        return ApiResponse.ok("Appointment deleted.");
    }

    private UserAccountEntity currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserAccountEntity account)) {
            throw new IllegalStateException("Authenticated user is missing.");
        }
        return account;
    }
}
