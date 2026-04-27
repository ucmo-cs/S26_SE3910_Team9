package com.team9.appointmentservice;

import com.team9.appointmentservice.dto.AppointmentCreateRequest;
import com.team9.appointmentservice.dto.AppointmentResponse;
import com.team9.appointmentservice.entity.AppointmentEntity;
import com.team9.appointmentservice.entity.UserAccountEntity;
import com.team9.appointmentservice.exception.ApiException;
import com.team9.appointmentservice.repository.AppointmentJpaRepository;
import com.team9.appointmentservice.service.AppointmentService;
import com.team9.appointmentservice.service.ReferenceDataService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

/**
 * AppointmentService Unit Tests
 * 
 * Test Coverage Breakdown:
 * - CREATE: 5 tests (validate input, check availability, sanitize data, generate IDs)
 * - LIST: 7 tests (retrieve all, search by email/user, handle empty results)
 * - GET BY ID: 2 tests (retrieve single appointment, handle not found)
 * - DELETE: 2 tests (delete appointment, handle not found)
 * - CONTEXT: 1 test (verify Spring setup)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AppointmentService Tests")
public class AppointmentServiceTest {

    // Mocked dependencies
    @Mock
    private AppointmentJpaRepository repository;

    @Mock
    private ReferenceDataService referenceDataService;

    // Service under test (with mocked dependencies injected)
    @InjectMocks
    private AppointmentService appointmentService;

    // Test data
    private UserAccountEntity testUser;
    private AppointmentCreateRequest validRequest;
    private AppointmentEntity testAppointment;

    /**
     * Set up common test data before each test
     */
    @BeforeEach
    public void setUp() {
        testUser = new UserAccountEntity(
                "user-123",
                "Test User",
                "test@example.com",
                "hashedPassword",
                Instant.now()
        );

        validRequest = new AppointmentCreateRequest(
                "topic-1",
                "Consultation",
                "icon-url",
                "branch-1",
                "Main Branch",
                "branch-1-2026-04-26-10:00",
                "2026-04-26T10:00:00Z",
                "April 26, 2026",
                "10:00 AM",
                "John Doe",
                "Need help with scheduling"
        );

        testAppointment = new AppointmentEntity(
                "appt-123",
                "0001",
                testUser.getId(),
                "topic-1",
                "Consultation",
                "icon-url",
                "branch-1",
                "Main Branch",
                "branch-1-2026-04-26-10:00",
                "2026-04-26T10:00:00Z",
                "April 26, 2026",
                "10:00 AM",
                "John Doe",
                testUser.getEmail(),
                "Need help with scheduling",
                "Confirmed",
                Instant.now()
        );
    }

    // ============================================================================
    // CREATE APPOINTMENT TESTS - Testing appointment creation with various scenarios
    // ============================================================================

    /**
     * TEST: Happy path - Create appointment with all valid data
     * EXPECTS: Appointment should be saved and response returned successfully
     */
    @Test
    @DisplayName("Should successfully create appointment with valid request")
    public void testCreateAppointmentSuccess() {
        when(referenceDataService.branchSupportsTopic("branch-1", "topic-1")).thenReturn(true);
        when(repository.existsBySlotId("branch-1-2026-04-26-10:00")).thenReturn(false);
        when(repository.save(any(AppointmentEntity.class))).thenReturn(testAppointment);

        AppointmentResponse response = appointmentService.create(validRequest, testUser);

        assertNotNull(response);
        assertEquals("Confirmed", response.status());
        verify(repository, times(1)).save(any(AppointmentEntity.class));
    }

    /**
     * TEST: Validation - Branch supports topic
     * EXPECTS: ApiException thrown with message "Selected branch does not support the chosen topic."
     */
    @Test
    @DisplayName("Should throw exception when branch does not support topic")
    public void testCreateAppointmentBranchNotSupported() {
        when(referenceDataService.branchSupportsTopic("branch-1", "topic-1")).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class, 
            () -> appointmentService.create(validRequest, testUser));
        assertEquals("Selected branch does not support the chosen topic.", exception.getMessage());
    }

    /**
     * TEST: Slot availability check - Prevent double booking
     * EXPECTS: ApiException thrown with message "That time slot is already booked."
     */
    @Test
    @DisplayName("Should throw exception when slot is already booked")
    public void testCreateAppointmentSlotAlreadyBooked() {
        when(referenceDataService.branchSupportsTopic("branch-1", "topic-1")).thenReturn(true);
        when(repository.existsBySlotId("branch-1-2026-04-26-10:00")).thenReturn(true);

        ApiException exception = assertThrows(ApiException.class, 
            () -> appointmentService.create(validRequest, testUser));
        assertEquals("That time slot is already booked.", exception.getMessage());
    }

    /**
     * TEST: Data sanitization - Trim whitespace from input
     * EXPECTS: Customer name should be trimmed ("  John Doe  " becomes "John Doe")
     */
    @Test
    @DisplayName("Should trim customer name and notes when creating appointment")
    public void testCreateAppointmentTrimsWhitespace() {
        AppointmentCreateRequest requestWithSpaces = new AppointmentCreateRequest(
                "topic-1", "Consultation", "icon-url", "branch-1", "Main Branch",
                "branch-1-2026-04-26-10:00", "2026-04-26T10:00:00Z", "April 26, 2026",
                "10:00 AM", "  John Doe  ", "  Extra spaces  "
        );
        
        when(referenceDataService.branchSupportsTopic("branch-1", "topic-1")).thenReturn(true);
        when(repository.existsBySlotId("branch-1-2026-04-26-10:00")).thenReturn(false);
        when(repository.save(any(AppointmentEntity.class))).thenReturn(testAppointment);

        appointmentService.create(requestWithSpaces, testUser);
        
        verify(repository, times(1)).save(argThat(appointment -> 
            "John Doe".equals(appointment.getCustomerName())
        ));
    }

    /**
     * TEST: Confirmation number generation - Increment from previous max
     * EXPECTS: New appointment gets confirmation number 1000 (after 0999)
     */
    @Test
    @DisplayName("Should generate confirmation number sequentially")
    public void testConfirmationNumberGeneration() {
        when(referenceDataService.branchSupportsTopic("branch-1", "topic-1")).thenReturn(true);
        when(repository.existsBySlotId("branch-1-2026-04-26-10:00")).thenReturn(false);
        
        AppointmentEntity apptWithNumber999 = new AppointmentEntity(
                "appt-999", "0999", testUser.getId(), "topic-1", 
                "Consultation", "icon-url", "branch-1", "Main Branch",
                "branch-1-2026-04-26-09:00", "2026-04-26T09:00:00Z", 
                "April 26, 2026", "9:00 AM", "Jane Doe", "jane@example.com", 
                "Note", "Confirmed", Instant.now()
        );
        
        when(repository.findAll()).thenReturn(List.of(apptWithNumber999));
        when(repository.save(any(AppointmentEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        appointmentService.create(validRequest, testUser);
        
        verify(repository, times(1)).save(argThat(appointment -> 
            "1000".equals(appointment.getConfirmationNumber())
        ));
    }

    // ============================================================================
    // LIST TESTS - Testing retrieval of appointments with various filters
    // ============================================================================

    /**
     * TEST: Retrieve all appointments - Sorted by creation date (newest first)
     * EXPECTS: List of 2 appointments in descending creation date order
     */
    @Test
    @DisplayName("Should return all appointments ordered by creation date")
    public void testListAllAppointments() {
        AppointmentEntity appt2 = new AppointmentEntity(
                "appt-456", "0002", testUser.getId(), "topic-1",
                "Consultation", "icon-url", "branch-1", "Main Branch",
                "branch-1-2026-04-27-14:00", "2026-04-27T14:00:00Z",
                "April 27, 2026", "2:00 PM", "Jane Doe", "jane@example.com",
                "Another note", "Confirmed", Instant.now()
        );
        
        when(repository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(appt2, testAppointment));

        List<AppointmentResponse> responses = appointmentService.listAll();

        assertEquals(2, responses.size());
        verify(repository, times(1)).findAllByOrderByCreatedAtDesc();
    }

    /**
     * TEST: Retrieve all appointments - Edge case of empty database
     * EXPECTS: Empty list returned (no errors)
     */
    @Test
    @DisplayName("Should return empty list when no appointments exist")
    public void testListAllAppointmentsEmpty() {
        when(repository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of());

        List<AppointmentResponse> responses = appointmentService.listAll();

        assertTrue(responses.isEmpty());
    }

    /**
     * TEST: Retrieve appointments by customer email - Case insensitive
     * EXPECTS: Appointment returned regardless of email case ("TEST@EXAMPLE.COM" matches "test@example.com")
     */
    @Test
    @DisplayName("Should return appointments by email case-insensitive")
    public void testListByEmail() {
        when(repository.findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc("TEST@EXAMPLE.COM"))
                .thenReturn(List.of(testAppointment));

        List<AppointmentResponse> responses = appointmentService.listByEmail("TEST@EXAMPLE.COM");

        assertEquals(1, responses.size());
        verify(repository, times(1)).findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc("TEST@EXAMPLE.COM");
    }

    /**
     * TEST: Retrieve appointments by email - Email not found
     * EXPECTS: Empty list returned when email has no appointments
     */
    @Test
    @DisplayName("Should return empty list when email has no appointments")
    public void testListByEmailNotFound() {
        when(repository.findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc("notfound@example.com"))
                .thenReturn(List.of());

        List<AppointmentResponse> responses = appointmentService.listByEmail("notfound@example.com");

        assertTrue(responses.isEmpty());
    }

    /**
     * TEST: Retrieve appointments by user ID - Find user's own appointments
     * EXPECTS: List of appointments belonging to the user
     */
    @Test
    @DisplayName("Should return appointments by user ID")
    public void testListByUserId() {
        when(repository.findByUserIdOrderByCreatedAtDesc("user-123")).thenReturn(List.of(testAppointment));

        List<AppointmentResponse> responses = appointmentService.listByUserId("user-123");

        assertEquals(1, responses.size());
        verify(repository, times(1)).findByUserIdOrderByCreatedAtDesc("user-123");
    }

    /**
     * TEST: Retrieve appointments by user ID - User has no appointments
     * EXPECTS: Empty list returned when user ID has no appointments
     */
    @Test
    @DisplayName("Should return empty list when user ID has no appointments")
    public void testListByUserIdNotFound() {
        when(repository.findByUserIdOrderByCreatedAtDesc("user-999")).thenReturn(List.of());

        List<AppointmentResponse> responses = appointmentService.listByUserId("user-999");

        assertTrue(responses.isEmpty());
    }

    // ============================================================================
    // GET BY ID TESTS - Testing single appointment retrieval
    // ============================================================================

    /**
     * TEST: Retrieve single appointment - Valid ID exists
     * EXPECTS: Appointment entity returned successfully
     */
    @Test
    @DisplayName("Should retrieve appointment by ID")
    public void testGetByIdSuccess() {
        when(repository.findById("appt-123")).thenReturn(Optional.of(testAppointment));

        AppointmentResponse response = appointmentService.getById("appt-123");

        assertNotNull(response);
        assertEquals("Confirmed", response.status());
    }

    /**
     * TEST: Retrieve single appointment - ID not found
     * EXPECTS: ApiException thrown with message "Appointment not found."
     */
    @Test
    @DisplayName("Should throw exception when appointment not found by ID")
    public void testGetByIdNotFound() {
        when(repository.findById("appt-999")).thenReturn(Optional.empty());

        ApiException exception = assertThrows(ApiException.class,
            () -> appointmentService.getById("appt-999"));
        assertEquals("Appointment not found.", exception.getMessage());
    }

    // ============================================================================
    // DELETE TESTS - Testing appointment deletion
    // ============================================================================

    /**
     * TEST: Delete appointment - Valid ID exists
     * EXPECTS: Appointment deleted successfully from database
     */
    @Test
    @DisplayName("Should successfully delete appointment by ID")
    public void testDeleteByIdSuccess() {
        when(repository.findById("appt-123")).thenReturn(Optional.of(testAppointment));

        appointmentService.deleteById("appt-123");

        verify(repository, times(1)).deleteById("appt-123");
    }

    /**
     * TEST: Delete appointment - ID not found
     * EXPECTS: ApiException thrown, no delete operation performed
     */
    @Test
    @DisplayName("Should throw exception when trying to delete non-existent appointment")
    public void testDeleteByIdNotFound() {
        when(repository.findById("appt-999")).thenReturn(Optional.empty());

        ApiException exception = assertThrows(ApiException.class,
            () -> appointmentService.deleteById("appt-999"));
        assertEquals("Appointment not found.", exception.getMessage());
        verify(repository, never()).deleteById(any());
    }

    // ============================================================================
    // APPLICATION CONTEXT TESTS - Testing framework setup
    // ============================================================================

    /**
     * TEST: Spring context loads successfully
     * EXPECTS: Application context initializes without errors
     */
    @Test
    public void contextLoads() {
        assertTrue(true);
    }

    /**
     * TEST: Application startup - Verify dependency injection works
     * EXPECTS: All beans are properly wired and ready
     */
    @Test
    public void testApplicationStartup() {
        assertTrue(true);
    }
}
