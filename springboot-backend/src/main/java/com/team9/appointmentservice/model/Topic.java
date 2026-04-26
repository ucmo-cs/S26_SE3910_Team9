package com.team9.appointmentservice.model;

public record Topic(
        String id,
        String name,
        String icon,
        String overview,
        String typicalHelp,
        String suggestedDuration
) {
}
