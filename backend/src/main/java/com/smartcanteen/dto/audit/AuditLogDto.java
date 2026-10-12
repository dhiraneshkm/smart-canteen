package com.smartcanteen.dto.audit;

import com.smartcanteen.entity.AuditLog;

import java.time.LocalDateTime;

public class AuditLogDto {
    private Long id;
    private String adminUsername;
    private String action;
    private String entityName;
    private String entityId;
    private String details;
    private String ipAddress;
    private LocalDateTime createdAt;

    public AuditLogDto() {
    }

    public static AuditLogDto fromEntity(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        if (log.getAdminUser() != null) {
            dto.setAdminUsername(log.getAdminUser().getUsername());
        }
        dto.setAction(log.getAction());
        dto.setEntityName(log.getEntityName());
        dto.setEntityId(log.getEntityId());
        dto.setDetails(log.getDetails());
        dto.setIpAddress(log.getIpAddress());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
