package com.smartcanteen.dto.queue;

import com.smartcanteen.entity.QueueTicket;
import com.smartcanteen.entity.QueueTicketStatus;

import java.time.LocalDateTime;

public class QueueTicketDto {
    private Long id;
    private String ticketNumber;
    private Long orderId;
    private String orderNumber;
    private Integer queuePosition;
    private Integer estimatedWaitMinutes;
    private QueueTicketStatus status;
    private LocalDateTime issuedAt;
    private LocalDateTime readyAt;
    private LocalDateTime completedAt;

    public QueueTicketDto() {
    }

    public static QueueTicketDto fromEntity(QueueTicket ticket) {
        QueueTicketDto dto = new QueueTicketDto();
        dto.setId(ticket.getId());
        dto.setTicketNumber(ticket.getTicketNumber());
        if (ticket.getOrder() != null) {
            dto.setOrderId(ticket.getOrder().getId());
            dto.setOrderNumber(ticket.getOrder().getOrderNumber());
        }
        dto.setQueuePosition(ticket.getQueuePosition());
        dto.setEstimatedWaitMinutes(ticket.getEstimatedWaitMinutes());
        dto.setStatus(ticket.getStatus());
        dto.setIssuedAt(ticket.getIssuedAt());
        dto.setReadyAt(ticket.getReadyAt());
        dto.setCompletedAt(ticket.getCompletedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Integer getQueuePosition() {
        return queuePosition;
    }

    public void setQueuePosition(Integer queuePosition) {
        this.queuePosition = queuePosition;
    }

    public Integer getEstimatedWaitMinutes() {
        return estimatedWaitMinutes;
    }

    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) {
        this.estimatedWaitMinutes = estimatedWaitMinutes;
    }

    public QueueTicketStatus getStatus() {
        return status;
    }

    public void setStatus(QueueTicketStatus status) {
        this.status = status;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public LocalDateTime getReadyAt() {
        return readyAt;
    }

    public void setReadyAt(LocalDateTime readyAt) {
        this.readyAt = readyAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
