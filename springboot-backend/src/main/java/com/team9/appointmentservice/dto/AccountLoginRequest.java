package com.team9.appointmentservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AccountLoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {
}
