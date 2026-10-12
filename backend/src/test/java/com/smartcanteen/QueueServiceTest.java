package com.smartcanteen;

import com.smartcanteen.entity.*;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.QueueTicketRepository;
import com.smartcanteen.service.QueueService;
import com.smartcanteen.websocket.WebSocketNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QueueServiceTest {

    @Mock
    private QueueTicketRepository queueTicketRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private WebSocketNotificationService webSocketNotificationService;

    private QueueService queueService;

    @BeforeEach
    void setUp() {
        queueService = new QueueService(queueTicketRepository, orderRepository, webSocketNotificationService, 2);
    }

    @Test
    void testGenerateTicketForOrder() {
        Order order = new Order();
        order.setId(101L);
        order.setOrderNumber("ORD-20261011-001");

        FoodItem dosa = new FoodItem();
        dosa.setName("Dosa");
        dosa.setPreparationTimeMinutes(10);

        OrderItem item = new OrderItem(order, dosa, "Dosa", new BigDecimal("60.00"), 2);
        order.addItem(item);

        when(queueTicketRepository.getMaxTicketId()).thenReturn(5L);
        when(queueTicketRepository.findByStatusInOrderByQueuePositionAsc(any())).thenReturn(Collections.emptyList());
        when(queueTicketRepository.save(any(QueueTicket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QueueTicket ticket = queueService.generateTicketForOrder(order);

        assertNotNull(ticket);
        assertEquals("TKT-006", ticket.getTicketNumber());
        assertEquals(1, ticket.getQueuePosition());
        assertTrue(ticket.getEstimatedWaitMinutes() >= 10);
    }

    @Test
    void testCalculateOrderBasePrepTime() {
        Order order = new Order();
        FoodItem item1 = new FoodItem();
        item1.setPreparationTimeMinutes(15);
        FoodItem item2 = new FoodItem();
        item2.setPreparationTimeMinutes(5);

        order.addItem(new OrderItem(order, item1, "Item1", new BigDecimal("100"), 1));
        order.addItem(new OrderItem(order, item2, "Item2", new BigDecimal("50"), 2));

        int prepTime = queueService.calculateOrderBasePrepTime(order);
        assertTrue(prepTime >= 15, "Base prep time should consider the maximum item duration + extra items");
    }
}
