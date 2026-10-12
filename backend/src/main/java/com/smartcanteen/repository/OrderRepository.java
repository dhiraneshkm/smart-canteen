package com.smartcanteen.repository;

import com.smartcanteen.entity.Order;
import com.smartcanteen.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);

    List<Order> findByPickupSlotIdOrderByCreatedAtAsc(Long slotId);

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate ORDER BY o.createdAt DESC")
    List<Order> findOrdersInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    long countByStatus(OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startOfDay AND o.createdAt <= :endOfDay")
    long countOrdersToday(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status NOT IN ('CANCELLED', 'REJECTED') AND o.createdAt >= :startOfDay AND o.createdAt <= :endOfDay")
    BigDecimal sumSalesToday(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status NOT IN ('CANCELLED', 'REJECTED')")
    BigDecimal sumTotalLifetimeSales();
}
