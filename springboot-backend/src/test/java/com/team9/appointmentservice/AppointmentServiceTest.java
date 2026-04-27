package com.team9.appointmentservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class AppointmentServiceTest {

    @Test
    public void contextLoads() {
        // This test verifies that the Spring Boot application context loads successfully
        assertTrue(true);
    }

    @Test
    public void testApplicationStartup() {
        // Test that the appointment service application starts without errors
        assertTrue(true);
    }
}
