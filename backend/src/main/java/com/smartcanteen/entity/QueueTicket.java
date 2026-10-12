package com.smartcanteen.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_tickets")
public class QueueTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", nullable = false, unique = true, length = 32)
    private String ticketNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    @JsonIgnore
    private Order order;

    @Column(name = "queue_position", nullable = false)
    private Integer queuePosition = 1;

    @Column(name = "estimated_wait_minutes", nullable = false)
    private Integer estimatedWaitMinutes = 10;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private QueueTicketStatus status = QueueTicketStatus.WAITING;

    @Column(name = "issued_at", updatable = false)
    private LocalDateTime issuedAt;

    @Column(name = "ready_at")
    private LocalDateTime readyAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public QueueTicket() {
    }

    public QueueTicket(String ticketNumber, Order order, Integer queuePosition, Integer estimatedWaitMinutes) {
        this.ticketNumber = ticketNumber;
        this.order = order;
        this.queuePosition = queuePosition;
        this.estimatedWaitMinutes = estimatedWaitMinutes;
        this.status = QueueTicketStatus.WAITING;
    }

    @PrePersist
    protected void onCreate() {
        this.issuedAt = LocalDateTime.now();
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

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
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
