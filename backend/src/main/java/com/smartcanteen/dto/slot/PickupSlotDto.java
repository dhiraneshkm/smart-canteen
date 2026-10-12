package com.smartcanteen.dto.slot;

import com.smartcanteen.entity.PickupSlot;

import java.time.LocalDate;
import java.time.LocalTime;

public class PickupSlotDto {
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate slotDate;
    private Integer maxOrdersCapacity;
    private Integer currentBookedCount;
    private Integer remainingCapacity;
    private boolean active;
    private boolean available;
    private String label;

    public PickupSlotDto() {
    }

    public static PickupSlotDto fromEntity(PickupSlot slot) {
        PickupSlotDto dto = new PickupSlotDto();
        dto.setId(slot.getId());
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        dto.setSlotDate(slot.getSlotDate());
        dto.setMaxOrdersCapacity(slot.getMaxOrdersCapacity());
        dto.setCurrentBookedCount(slot.getCurrentBookedCount());
        int remaining = Math.max(0, slot.getMaxOrdersCapacity() - slot.getCurrentBookedCount());
        dto.setRemainingCapacity(remaining);
        dto.setActive(slot.isActive());
        dto.setAvailable(slot.isActive() && remaining > 0);
        dto.setLabel(slot.getStartTime() + " - " + slot.getEndTime());
        return dto;
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

    public Integer getRemainingCapacity() {
        return remainingCapacity;
    }

    public void setRemainingCapacity(Integer remainingCapacity) {
        this.remainingCapacity = remainingCapacity;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
