package com.team9.appointmentservice.repository;

import com.team9.appointmentservice.model.UserAccount;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
public class InMemoryUserAccountRepository implements UserAccountRepository {
    private final ConcurrentMap<String, UserAccount> store = new ConcurrentHashMap<>();

    @Override
    public Optional<UserAccount> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return store.values().stream()
                .filter(account -> account.email().equalsIgnoreCase(email.trim()))
                .findFirst();
    }

    @Override
    public List<UserAccount> findAll() {
        return store.values().stream().toList();
    }

    @Override
    public UserAccount save(UserAccount account) {
        store.put(account.id(), account);
        return account;
    }
}
