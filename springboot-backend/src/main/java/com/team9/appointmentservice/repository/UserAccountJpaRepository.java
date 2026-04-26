package com.team9.appointmentservice.repository;

import com.team9.appointmentservice.entity.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountJpaRepository extends JpaRepository<UserAccountEntity, String> {
    Optional<UserAccountEntity> findByEmailIgnoreCase(String email);
}
