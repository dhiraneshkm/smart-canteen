package com.smartcanteen.dto.report;

import java.math.BigDecimal;

public class PopularItemDto {
    private String name;
    private Long orderCount;
    private BigDecimal revenue;

    public PopularItemDto() {
    }

    public PopularItemDto(String name, Long orderCount, BigDecimal revenue) {
        this.name = name;
        this.orderCount = orderCount;
        this.revenue = revenue;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}
