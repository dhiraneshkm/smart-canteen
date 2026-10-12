package com.smartcanteen.service;

import com.smartcanteen.dto.queue.QueueStatusDto;
import com.smartcanteen.dto.queue.QueueTicketDto;
import com.smartcanteen.entity.*;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.QueueTicketRepository;
import com.smartcanteen.websocket.WebSocketNotificationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueueService {

    private final QueueTicketRepository queueTicketRepository;
    private final OrderRepository orderRepository;
    private final WebSocketNotificationService webSocketNotificationService;
    private final int kitchenConcurrentCapacity;

    public QueueService(QueueTicketRepository queueTicketRepository,
                        OrderRepository orderRepository,
                        WebSocketNotificationService webSocketNotificationService,
                        @Value("${app.kitchen.concurrent-stations:2}") int kitchenConcurrentCapacity) {
        this.queueTicketRepository = queueTicketRepository;
        this.orderRepository = orderRepository;
        this.webSocketNotificationService = webSocketNotificationService;
        this.kitchenConcurrentCapacity = Math.max(1, kitchenConcurrentCapacity);
    }

    @Transactional
    public synchronized QueueTicket generateTicketForOrder(Order order) {
        long nextId = queueTicketRepository.getMaxTicketId() + 1;
        String ticketNumber = String.format("TKT-%03d", nextId);

        // Calculate order base prep time
        int basePrepTime = calculateOrderBasePrepTime(order);

        // Calculate queue workload before this order
        List<QueueTicket> activeTickets = queueTicketRepository.findByStatusInOrderByQueuePositionAsc(
                Arrays.asList(QueueTicketStatus.WAITING, QueueTicketStatus.PREPARING)
        );

        int activeWorkloadMinutes = 0;
        for (QueueTicket t : activeTickets) {
            if (t.getOrder() != null) {
                activeWorkloadMinutes += calculateOrderBasePrepTime(t.getOrder());
            } else {
                activeWorkloadMinutes += 8;
            }
        }

        int estimatedWait = (activeWorkloadMinutes / kitchenConcurrentCapacity) + basePrepTime;
        int queuePosition = activeTickets.size() + 1;

        QueueTicket ticket = new QueueTicket(ticketNumber, order, queuePosition, Math.max(5, estimatedWait));
        ticket = queueTicketRepository.save(ticket);

        return ticket;
    }

    public int calculateOrderBasePrepTime(Order order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()) {
            return 8;
        }

        int maxItemTime = 5;
        int additionalItemsCount = 0;

        for (OrderItem item : order.getItems()) {
            if (item.getFoodItem() != null && item.getFoodItem().getPreparationTimeMinutes() != null) {
                maxItemTime = Math.max(maxItemTime, item.getFoodItem().getPreparationTimeMinutes());
            }
            if (item.getQuantity() != null && item.getQuantity() > 1) {
                additionalItemsCount += (item.getQuantity() - 1);
            }
        }
        additionalItemsCount += Math.max(0, order.getItems().size() - 1);

        // Formula: max(P_i) + additional items penalty
        return maxItemTime + (int) Math.round(additionalItemsCount * 1.5);
    }

    @Transactional
    public void recalculateQueuePositions() {
        List<QueueTicket> activeTickets = queueTicketRepository.findByStatusInOrderByQueuePositionAsc(
                Arrays.asList(QueueTicketStatus.WAITING, QueueTicketStatus.PREPARING)
        );

        int currentPos = 1;
        int cumulativeWorkload = 0;

        for (QueueTicket ticket : activeTickets) {
            ticket.setQueuePosition(currentPos);
            int baseTime = calculateOrderBasePrepTime(ticket.getOrder());
            int waitMinutes = (cumulativeWorkload / kitchenConcurrentCapacity) + baseTime;
            ticket.setEstimatedWaitMinutes(Math.max(3, waitMinutes));
            cumulativeWorkload += baseTime;
            currentPos++;
            queueTicketRepository.save(ticket);
        }

        QueueStatusDto statusDto = getQueueStatus();
        webSocketNotificationService.sendQueueUpdate(statusDto);
    }

    @Transactional
    public void updateTicketStatus(Order order, OrderStatus newStatus) {
        QueueTicket ticket = order.getQueueTicket();
        if (ticket == null) {
            return;
        }

        switch (newStatus) {
            case PREPARING -> ticket.setStatus(QueueTicketStatus.PREPARING);
            case READY -> {
                ticket.setStatus(QueueTicketStatus.READY);
                ticket.setReadyAt(LocalDateTime.now());
                ticket.setQueuePosition(0);
                ticket.setEstimatedWaitMinutes(0);
            }
            case COLLECTED -> {
                ticket.setStatus(QueueTicketStatus.COMPLETED);
                ticket.setCompletedAt(LocalDateTime.now());
                ticket.setQueuePosition(0);
                ticket.setEstimatedWaitMinutes(0);
            }
            case CANCELLED, REJECTED -> {
                ticket.setStatus(QueueTicketStatus.CANCELLED);
                ticket.setCompletedAt(LocalDateTime.now());
                ticket.setQueuePosition(0);
                ticket.setEstimatedWaitMinutes(0);
            }
            default -> {}
        }

        queueTicketRepository.save(ticket);
        recalculateQueuePositions();
    }

    public QueueStatusDto getQueueStatus() {
        long waiting = orderRepository.countByStatus(OrderStatus.PLACED) + orderRepository.countByStatus(OrderStatus.ACCEPTED);
        long preparing = orderRepository.countByStatus(OrderStatus.PREPARING);
        long ready = orderRepository.countByStatus(OrderStatus.READY);

        List<QueueTicket> activeTickets = queueTicketRepository.findByStatusInOrderByQueuePositionAsc(
                Arrays.asList(QueueTicketStatus.WAITING, QueueTicketStatus.PREPARING, QueueTicketStatus.READY)
        );

        int avgWait = activeTickets.stream()
                .filter(t -> t.getStatus() != QueueTicketStatus.READY)
                .mapToInt(QueueTicket::getEstimatedWaitMinutes)
                .findFirst().orElse(8);

        List<QueueTicketDto> dtos = activeTickets.stream()
                .map(QueueTicketDto::fromEntity)
                .collect(Collectors.toList());

        return new QueueStatusDto(waiting, preparing, ready, avgWait, dtos);
    }

    public QueueTicketDto getTicketByOrderId(Long orderId) {
        QueueTicket ticket = queueTicketRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found for order id: " + orderId));
        return QueueTicketDto.fromEntity(ticket);
    }
}
