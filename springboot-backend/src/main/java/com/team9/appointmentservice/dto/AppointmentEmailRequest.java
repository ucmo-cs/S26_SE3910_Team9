package com.team9.appointmentservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AppointmentEmailRequest(
        @Email @NotBlank String customerEmail,
        @NotBlank String customerName,
        @NotBlank String topicName,
        @NotBlank String branchName,
        @NotBlank String dateLabel,
        @NotBlank String timeLabel,
        @NotBlank String confirmationNumber
) {
}
