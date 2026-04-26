package com.team9.appointmentservice.repository;

import com.team9.appointmentservice.model.Appointment;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository {
    List<Appointment> findAll();

    Optional<Appointment> findById(String id);

    Optional<Appointment> findBySlotId(String slotId);

    List<Appointment> findByCustomerEmail(String email);

    List<Appointment> findByUserId(String userId);

    Appointment save(Appointment appointment);

    void deleteById(String id);

    long count();
}
