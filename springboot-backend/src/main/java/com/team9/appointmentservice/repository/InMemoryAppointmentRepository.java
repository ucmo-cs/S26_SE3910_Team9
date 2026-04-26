package com.team9.appointmentservice.repository;

import com.team9.appointmentservice.model.Appointment;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
public class InMemoryAppointmentRepository implements AppointmentRepository {
    private final ConcurrentMap<String, Appointment> store = new ConcurrentHashMap<>();

    @Override
    public List<Appointment> findAll() {
        return store.values().stream()
                .sorted(Comparator.comparing(Appointment::createdAt).reversed())
                .toList();
    }

    @Override
    public Optional<Appointment> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Optional<Appointment> findBySlotId(String slotId) {
        return store.values().stream()
                .filter(appointment -> appointment.slotId().equals(slotId))
                .findFirst();
    }

    @Override
    public List<Appointment> findByCustomerEmail(String email) {
        String normalized = email == null ? "" : email.trim().toLowerCase();
        return store.values().stream()
                .filter(appointment -> appointment.customerEmail().trim().toLowerCase().equals(normalized))
                .sorted(Comparator.comparing(Appointment::createdAt).reversed())
                .toList();
    }

    @Override
    public List<Appointment> findByUserId(String userId) {
        return store.values().stream()
                .filter(appointment -> appointment.userId().equals(userId))
                .sorted(Comparator.comparing(Appointment::createdAt).reversed())
                .toList();
    }

    @Override
    public Appointment save(Appointment appointment) {
        store.put(appointment.id(), appointment);
        return appointment;
    }

    @Override
    public void deleteById(String id) {
        store.remove(id);
    }

    @Override
    public long count() {
        return store.size();
    }
}
