package com.team9.appointmentservice.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.team9.appointmentservice.dto.AppointmentCreateRequest;
import com.team9.appointmentservice.dto.AppointmentResponse;
import com.team9.appointmentservice.entity.AppointmentEntity;
import com.team9.appointmentservice.entity.UserAccountEntity;
import com.team9.appointmentservice.exception.ApiException;
import com.team9.appointmentservice.repository.AppointmentJpaRepository;

@Service
public class AppointmentService {
    private final AppointmentJpaRepository repository;
    private final ReferenceDataService referenceDataService;

    public AppointmentService(AppointmentJpaRepository repository, ReferenceDataService referenceDataService) {
        this.repository = repository;
        this.referenceDataService = referenceDataService;
    }

    public AppointmentResponse create(AppointmentCreateRequest request, UserAccountEntity currentUser) {
        if (!referenceDataService.branchSupportsTopic(request.branchId(), request.topicId())) {
            throw new ApiException("Selected branch does not support the chosen topic.");
        }

        if (repository.existsBySlotId(request.slotId())) {
            throw new ApiException("That time slot is already booked.");
        }

        String confirmationNumber = nextConfirmationNumber();
        AppointmentEntity appointment = new AppointmentEntity(
                UUID.randomUUID().toString(),
                confirmationNumber,
                currentUser.getId(),
                request.topicId(),
                request.topicName(),
                request.topicIcon(),
                request.branchId(),
                request.branchName(),
                request.slotId(),
                request.startAtISO(),
                request.dateLabel(),
                request.timeLabel(),
                request.customerName().trim(),
                currentUser.getEmail().trim().toLowerCase(),
                request.notes() == null ? "" : request.notes().trim(),
                "Confirmed",
                Instant.now()
        );
        repository.save(appointment);
        return AppointmentResponse.from(appointment);
    }

    public java.util.List<AppointmentResponse> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(AppointmentResponse::from).toList();
    }

    public java.util.List<AppointmentResponse> listByEmail(String email) {
        return repository.findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(email).stream().map(AppointmentResponse::from).toList();
    }

    public java.util.List<AppointmentResponse> listByUserId(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(AppointmentResponse::from).toList();
    }

    public AppointmentResponse getById(String id) {
        AppointmentEntity appointment = repository.findById(id)
                .orElseThrow(() -> new ApiException("Appointment not found."));
        return AppointmentResponse.from(appointment);
    }

    public void deleteById(String id) {
        if (repository.findById(id).isEmpty()) {
            throw new ApiException("Appointment not found.");
        }
        repository.deleteById(id);
    }

    private String nextConfirmationNumber() {
        int max = repository.findAll().stream()
                .map(AppointmentEntity::getConfirmationNumber)
                .map(value -> value == null ? "" : value.replaceAll("\\D", ""))
                .filter(value -> !value.isBlank())
                .mapToInt(value -> {
                    try {
                        return Integer.parseInt(value);
                    } catch (NumberFormatException ignored) {
                        return 999;
                    }
                })
                .max()
                .orElse(999);
        return String.format("%04d", max + 1);
    }
}
