package com.team9.appointmentservice.dto;

import com.team9.appointmentservice.entity.AppointmentEntity;

import java.time.Instant;

public record AppointmentResponse(
        String id,
        String confirmationNumber,
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
    public static AppointmentResponse from(AppointmentEntity appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getConfirmationNumber(),
                appointment.getTopicId(),
                appointment.getTopicName(),
                appointment.getTopicIcon(),
                appointment.getBranchId(),
                appointment.getBranchName(),
                appointment.getSlotId(),
                appointment.getStartAtISO(),
                appointment.getDateLabel(),
                appointment.getTimeLabel(),
                appointment.getCustomerName(),
                appointment.getCustomerEmail(),
                appointment.getNotes(),
                appointment.getStatus(),
                appointment.getCreatedAt()
        );
    }
}
