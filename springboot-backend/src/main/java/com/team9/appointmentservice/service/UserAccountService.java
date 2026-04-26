package com.team9.appointmentservice.service;

import com.team9.appointmentservice.dto.AccountCreateRequest;
import com.team9.appointmentservice.dto.AccountLoginRequest;
import com.team9.appointmentservice.dto.AccountResponse;
import com.team9.appointmentservice.dto.LoginResponse;
import com.team9.appointmentservice.entity.UserAccountEntity;
import com.team9.appointmentservice.exception.ApiException;
import com.team9.appointmentservice.repository.UserAccountJpaRepository;
import com.team9.appointmentservice.security.JwtUtil;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class UserAccountService {
    private final UserAccountJpaRepository repository;
    private final PasswordHasher passwordHasher;
    private final JwtUtil jwtUtil;

    public UserAccountService(UserAccountJpaRepository repository, PasswordHasher passwordHasher, JwtUtil jwtUtil) {
        this.repository = repository;
        this.passwordHasher = passwordHasher;
        this.jwtUtil = jwtUtil;
    }

    public AccountResponse register(AccountCreateRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (repository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new ApiException("An account with that email already exists.");
        }

        UserAccountEntity account = new UserAccountEntity(
                UUID.randomUUID().toString(),
                request.fullName().trim(),
                normalizedEmail,
                passwordHasher.hash(request.password()),
                Instant.now()
        );
        repository.save(account);
        return new AccountResponse(account.getFullName(), account.getEmail());
    }

    public LoginResponse login(AccountLoginRequest request) {
        UserAccountEntity account = repository.findByEmailIgnoreCase(request.email().trim().toLowerCase())
                .orElseThrow(() -> new ApiException("Account not found."));

        if (!passwordHasher.matches(request.password(), account.getPasswordHash())) {
            throw new ApiException("Invalid credentials.");
        }

        String token = jwtUtil.generateToken(account);
        AccountResponse accountResponse = new AccountResponse(account.getFullName(), account.getEmail());
        return new LoginResponse(token, accountResponse);
    }

    public UserAccountEntity getByEmail(String email) {
        return repository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new ApiException("Account not found."));
    }
}
