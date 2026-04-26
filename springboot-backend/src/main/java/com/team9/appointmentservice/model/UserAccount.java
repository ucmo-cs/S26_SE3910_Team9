package com.team9.appointmentservice.model;

import java.time.Instant;

public record UserAccount(
        String id,
        String fullName,
        String email,
        String passwordHash,
        Instant createdAt
) {
}
