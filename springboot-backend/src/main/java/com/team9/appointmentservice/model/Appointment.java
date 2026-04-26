package com.team9.appointmentservice.model;

import java.time.Instant;

public record Appointment(
        String id,
        String confirmationNumber,
        String userId,
        String topicId,
        String topicName,
        String topicIcon,
        String branchId,
        String branchName,
        String slotId,
        String startAtISO,
        String dateLabel,
        String timeLabel,
        String customerName,
        String customerEmail,
        String notes,
        String status,
        Instant createdAt
) {
}
