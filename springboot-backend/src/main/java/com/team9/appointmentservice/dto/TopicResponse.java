package com.team9.appointmentservice.dto;

public record TopicResponse(
        String id,
        String name,
        String icon,
        String overview,
        String typicalHelp,
        String suggestedDuration
) {
}
