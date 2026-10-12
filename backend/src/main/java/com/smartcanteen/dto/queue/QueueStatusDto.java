package com.smartcanteen.dto.queue;

import java.util.List;

public class QueueStatusDto {
    private long totalWaitingOrders;
    private long totalPreparingOrders;
    private long totalReadyOrders;
    private int averageWaitMinutes;
    private List<QueueTicketDto> activeTickets;

    public QueueStatusDto() {
    }

    public QueueStatusDto(long totalWaitingOrders, long totalPreparingOrders, long totalReadyOrders, int averageWaitMinutes, List<QueueTicketDto> activeTickets) {
        this.totalWaitingOrders = totalWaitingOrders;
        this.totalPreparingOrders = totalPreparingOrders;
        this.totalReadyOrders = totalReadyOrders;
        this.averageWaitMinutes = averageWaitMinutes;
        this.activeTickets = activeTickets;
    }

    public long getTotalWaitingOrders() {
        return totalWaitingOrders;
    }

    public void setTotalWaitingOrders(long totalWaitingOrders) {
        this.totalWaitingOrders = totalWaitingOrders;
    }

    public long getTotalPreparingOrders() {
        return totalPreparingOrders;
    }

    public void setTotalPreparingOrders(long totalPreparingOrders) {
        this.totalPreparingOrders = totalPreparingOrders;
    }

    public long getTotalReadyOrders() {
        return totalReadyOrders;
    }

    public void setTotalReadyOrders(long totalReadyOrders) {
        this.totalReadyOrders = totalReadyOrders;
    }

    public int getAverageWaitMinutes() {
        return averageWaitMinutes;
    }

    public void setAverageWaitMinutes(int averageWaitMinutes) {
        this.averageWaitMinutes = averageWaitMinutes;
    }

    public List<QueueTicketDto> getActiveTickets() {
        return activeTickets;
    }

    public void setActiveTickets(List<QueueTicketDto> activeTickets) {
        this.activeTickets = activeTickets;
    }
}
