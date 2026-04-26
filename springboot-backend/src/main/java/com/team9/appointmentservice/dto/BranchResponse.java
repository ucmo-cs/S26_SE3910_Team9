package com.team9.appointmentservice.dto;

import java.util.List;

public record BranchResponse(
        String id,
        String name,
        List<String> topicIds
) {
}
