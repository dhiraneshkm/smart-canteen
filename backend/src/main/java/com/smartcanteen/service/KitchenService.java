package com.smartcanteen.service;

import com.smartcanteen.dto.order.OrderDto;
import com.smartcanteen.entity.OrderStatus;
import com.smartcanteen.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KitchenService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public KitchenService(OrderRepository orderRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    public List<OrderDto> getActiveKitchenOrders() {
        List<OrderStatus> activeStatuses = Arrays.asList(
                OrderStatus.PLACED,
                OrderStatus.ACCEPTED,
                OrderStatus.PREPARING,
                OrderStatus.READY
        );

        return orderRepository.findByStatusInOrderByCreatedAtAsc(activeStatuses).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    public OrderDto updatePreparationStatus(Long orderId, OrderStatus newStatus, String note) {
        return orderService.updateOrderStatus(orderId, newStatus, note);
    }
}
