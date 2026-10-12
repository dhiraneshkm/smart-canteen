package com.smartcanteen.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "pickup_slots")
public class PickupSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "slot_date")
    private LocalDate slotDate;

    @Column(name = "max_orders_capacity", nullable = false)
    private Integer maxOrdersCapacity = 30;

    @Column(name = "current_booked_count", nullable = false)
    private Integer currentBookedCount = 0;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public PickupSlot() {
    }

    public PickupSlot(LocalTime startTime, LocalTime endTime, Integer maxOrdersCapacity) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxOrdersCapacity = maxOrdersCapacity != null ? maxOrdersCapacity : 30;
        this.currentBookedCount = 0;
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public boolean hasAvailableCapacity() {
        return active && (currentBookedCount < maxOrdersCapacity);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public Integer getMaxOrdersCapacity() {
        return maxOrdersCapacity;
    }

    public void setMaxOrdersCapacity(Integer maxOrdersCapacity) {
        this.maxOrdersCapacity = maxOrdersCapacity;
    }

    public Integer getCurrentBookedCount() {
        return currentBookedCount;
    }

    public void setCurrentBookedCount(Integer currentBookedCount) {
        this.currentBookedCount = currentBookedCount;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
