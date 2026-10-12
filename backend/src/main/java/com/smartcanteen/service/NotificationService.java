package com.smartcanteen.service;

import com.smartcanteen.entity.Notification;
import com.smartcanteen.entity.NotificationType;
import com.smartcanteen.entity.User;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.repository.NotificationRepository;
import com.smartcanteen.websocket.WebSocketNotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final WebSocketNotificationService webSocketNotificationService;

    public NotificationService(NotificationRepository notificationRepository,
                               WebSocketNotificationService webSocketNotificationService) {
        this.notificationRepository = notificationRepository;
        this.webSocketNotificationService = webSocketNotificationService;
    }

    @Transactional
    public Notification sendNotification(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        notification = notificationRepository.save(notification);

        webSocketNotificationService.sendUserAlert(user.getId(), notification);
        return notification;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
