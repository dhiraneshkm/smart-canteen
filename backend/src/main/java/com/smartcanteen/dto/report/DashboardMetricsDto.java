package com.smartcanteen.dto.report;

import java.math.BigDecimal;
import java.util.List;

public class DashboardMetricsDto {
    private long totalOrdersToday;
    private BigDecimal salesToday;
    private BigDecimal totalLifetimeSales;
    private long pendingOrders;
    private long preparingOrders;
    private long readyOrders;
    private long completedOrders;
    private long cancelledOrders;
    private int averagePreparationTime;
    private int averageWaitingTime;
    private double cancellationRate;
    private List<PopularItemDto> popularItems;

    public DashboardMetricsDto() {
    }

    public long getTotalOrdersToday() {
        return totalOrdersToday;
    }

    public void setTotalOrdersToday(long totalOrdersToday) {
        this.totalOrdersToday = totalOrdersToday;
    }

    public BigDecimal getSalesToday() {
        return salesToday;
    }

    public void setSalesToday(BigDecimal salesToday) {
        this.salesToday = salesToday;
    }

    public BigDecimal getTotalLifetimeSales() {
        return totalLifetimeSales;
    }

    public void setTotalLifetimeSales(BigDecimal totalLifetimeSales) {
        this.totalLifetimeSales = totalLifetimeSales;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getPreparingOrders() {
        return preparingOrders;
    }

    public void setPreparingOrders(long preparingOrders) {
        this.preparingOrders = preparingOrders;
    }

    public long getReadyOrders() {
        return readyOrders;
    }

    public void setReadyOrders(long readyOrders) {
        this.readyOrders = readyOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public int getAveragePreparationTime() {
        return averagePreparationTime;
    }

    public void setAveragePreparationTime(int averagePreparationTime) {
        this.averagePreparationTime = averagePreparationTime;
    }

    public int getAverageWaitingTime() {
        return averageWaitingTime;
    }

    public void setAverageWaitingTime(int averageWaitingTime) {
        this.averageWaitingTime = averageWaitingTime;
    }

    public double getCancellationRate() {
        return cancellationRate;
    }

    public void setCancellationRate(double cancellationRate) {
        this.cancellationRate = cancellationRate;
    }

    public List<PopularItemDto> getPopularItems() {
        return popularItems;
    }

    public void setPopularItems(List<PopularItemDto> popularItems) {
        this.popularItems = popularItems;
    }
}
