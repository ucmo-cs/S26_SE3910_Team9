package com.team9.appointmentservice.repository;

import com.team9.appointmentservice.model.UserAccount;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository {
    Optional<UserAccount> findByEmail(String email);

    List<UserAccount> findAll();

    UserAccount save(UserAccount account);
}
