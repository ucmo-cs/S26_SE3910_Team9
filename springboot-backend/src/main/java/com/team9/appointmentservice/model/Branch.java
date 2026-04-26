package com.team9.appointmentservice.model;

import java.util.List;

public record Branch(
        String id,
        String name,
        List<String> topicIds
) {
}
