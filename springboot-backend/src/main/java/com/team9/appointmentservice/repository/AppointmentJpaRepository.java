package com.team9.appointmentservice.repository;

import com.team9.appointmentservice.entity.AppointmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentJpaRepository extends JpaRepository<AppointmentEntity, String> {
    Optional<AppointmentEntity> findBySlotId(String slotId);
    List<AppointmentEntity> findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String customerEmail);
    List<AppointmentEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    List<AppointmentEntity> findAllByOrderByCreatedAtDesc();
    boolean existsBySlotId(String slotId);
}
