package com.smartcanteen.websocket;

import com.smartcanteen.dto.order.OrderDto;
import com.smartcanteen.dto.queue.QueueStatusDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendOrderUpdate(OrderDto order) {
        messagingTemplate.convertAndSend("/topic/orders", order);
        if (order.getUserId() != null) {
            messagingTemplate.convertAndSend("/topic/orders/user/" + order.getUserId(), order);
        }
    }

    public void sendQueueUpdate(QueueStatusDto queueStatus) {
        messagingTemplate.convertAndSend("/topic/queue", queueStatus);
    }

    public void sendUserAlert(Long userId, Object payload) {
        messagingTemplate.convertAndSend("/topic/notifications/user/" + userId, payload);
    }
}
