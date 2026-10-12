package com.smartcanteen.dto.report;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SalesReportDto {
    private LocalDate reportDate;
    private long totalOrders;
    private BigDecimal grossSales;
    private long completedOrders;
    private long cancelledOrders;

    public SalesReportDto() {
    }

    public SalesReportDto(LocalDate reportDate, long totalOrders, BigDecimal grossSales, long completedOrders, long cancelledOrders) {
        this.reportDate = reportDate;
        this.totalOrders = totalOrders;
        this.grossSales = grossSales;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getGrossSales() {
        return grossSales;
    }

    public void setGrossSales(BigDecimal grossSales) {
        this.grossSales = grossSales;
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
}
