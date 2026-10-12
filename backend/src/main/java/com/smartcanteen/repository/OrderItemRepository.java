package com.smartcanteen.repository;

import com.smartcanteen.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi.itemName as name, SUM(oi.quantity) as totalQty, SUM(oi.subtotal) as totalRevenue " +
           "FROM OrderItem oi WHERE oi.order.status NOT IN ('CANCELLED', 'REJECTED') " +
           "GROUP BY oi.itemName ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findPopularItems(Pageable pageable);
}
