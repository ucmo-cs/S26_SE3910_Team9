package com.team9.appointmentservice.dto;

public record ApiResponse(
        boolean success,
        String message,
        String error,
        String details
) {
    public static ApiResponse ok(String message) {
        return new ApiResponse(true, message, null, null);
    }

    public static ApiResponse ok(String message, String details) {
        return new ApiResponse(true, message, null, details);
    }

    public static ApiResponse error(String message) {
        return new ApiResponse(false, null, message, null);
    }

    public static ApiResponse error(String message, String details) {
        return new ApiResponse(false, null, message, details);
    }
}
