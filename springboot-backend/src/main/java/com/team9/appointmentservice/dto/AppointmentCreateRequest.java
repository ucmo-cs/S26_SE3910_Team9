package com.team9.appointmentservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AppointmentCreateRequest(
        @NotBlank String topicId,
        @NotBlank String topicName,
        @NotBlank String topicIcon,
        @NotBlank String branchId,
        @NotBlank String branchName,
        @NotBlank String slotId,
        @NotBlank String startAtISO,
        @NotBlank String dateLabel,
        @NotBlank String timeLabel,
        @NotBlank String customerName,
        String notes
) {
}
