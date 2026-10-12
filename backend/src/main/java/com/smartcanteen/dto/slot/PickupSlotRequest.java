package com.smartcanteen.dto.slot;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class PickupSlotRequest {

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    private LocalDate slotDate;

    @NotNull(message = "Max orders capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer maxOrdersCapacity = 30;

    private Boolean active = true;

    public PickupSlotRequest() {
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
