package com.team9.appointmentservice.controller;

import com.team9.appointmentservice.dto.AccountCreateRequest;
import com.team9.appointmentservice.dto.AccountLoginRequest;
import com.team9.appointmentservice.dto.AccountResponse;
import com.team9.appointmentservice.dto.ApiResponse;
import com.team9.appointmentservice.dto.LoginResponse;
import com.team9.appointmentservice.service.UserAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final UserAccountService service;

    public AccountController(UserAccountService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<AccountResponse> register(@Valid @RequestBody AccountCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.register(request));
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody AccountLoginRequest request) {
        return service.login(request);
    }

    @PostMapping("/reset")
    public ApiResponse resetDemoData() {
        return ApiResponse.ok("Demo reset is not required in the database-backed build.");
    }
}
