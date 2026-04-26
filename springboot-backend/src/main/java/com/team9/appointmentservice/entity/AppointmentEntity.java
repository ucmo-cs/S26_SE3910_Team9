package com.team9.appointmentservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class AppointmentEntity {
    @Id
    @Column(nullable = false, updatable = false, length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String confirmationNumber;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String topicId;

    @Column(nullable = false)
    private String topicName;

    @Column(nullable = false)
    private String topicIcon;

    @Column(nullable = false)
    private String branchId;

    @Column(nullable = false)
    private String branchName;

    @Column(nullable = false)
    private String slotId;

    @Column(nullable = false)
    private String startAtISO;

    @Column(nullable = false)
    private String dateLabel;

    @Column(nullable = false)
    private String timeLabel;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(length = 2000)
    private String notes;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected AppointmentEntity() {
        // JPA
    }

    public AppointmentEntity(String id, String confirmationNumber, String userId, String topicId, String topicName,
                             String topicIcon, String branchId, String branchName, String slotId, String startAtISO,
                             String dateLabel, String timeLabel, String customerName, String customerEmail,
                             String notes, String status, Instant createdAt) {
        this.id = id;
        this.confirmationNumber = confirmationNumber;
        this.userId = userId;
        this.topicId = topicId;
        this.topicName = topicName;
        this.topicIcon = topicIcon;
        this.branchId = branchId;
        this.branchName = branchName;
        this.slotId = slotId;
        this.startAtISO = startAtISO;
        this.dateLabel = dateLabel;
        this.timeLabel = timeLabel;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void ensureDefaults() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (status == null || status.isBlank()) {
            status = "Confirmed";
        }
        if (notes == null) {
            notes = "";
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getConfirmationNumber() { return confirmationNumber; }
    public void setConfirmationNumber(String confirmationNumber) { this.confirmationNumber = confirmationNumber; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }
    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }
    public String getTopicIcon() { return topicIcon; }
    public void setTopicIcon(String topicIcon) { this.topicIcon = topicIcon; }
    public String getBranchId() { return branchId; }
    public void setBranchId(String branchId) { this.branchId = branchId; }
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public String getSlotId() { return slotId; }
    public void setSlotId(String slotId) { this.slotId = slotId; }
    public String getStartAtISO() { return startAtISO; }
    public void setStartAtISO(String startAtISO) { this.startAtISO = startAtISO; }
    public String getDateLabel() { return dateLabel; }
    public void setDateLabel(String dateLabel) { this.dateLabel = dateLabel; }
    public String getTimeLabel() { return timeLabel; }
    public void setTimeLabel(String timeLabel) { this.timeLabel = timeLabel; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
