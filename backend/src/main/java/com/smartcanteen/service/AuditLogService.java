package com.smartcanteen.service;

import com.smartcanteen.dto.audit.AuditLogDto;
import com.smartcanteen.entity.AuditLog;
import com.smartcanteen.entity.User;
import com.smartcanteen.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void recordLog(User adminUser, String action, String entityName, String entityId, String details, String ipAddress) {
        AuditLog log = new AuditLog(adminUser, action, entityName, entityId, details, ipAddress);
        auditLogRepository.save(log);
    }

    public List<AuditLogDto> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AuditLogDto::fromEntity)
                .collect(Collectors.toList());
    }
}
