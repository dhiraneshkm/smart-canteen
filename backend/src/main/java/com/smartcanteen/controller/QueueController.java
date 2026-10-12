package com.smartcanteen.controller;

import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.queue.QueueStatusDto;
import com.smartcanteen.dto.queue.QueueTicketDto;
import com.smartcanteen.service.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<QueueStatusDto>> getQueueStatus() {
        QueueStatusDto status = queueService.getQueueStatus();
        return ResponseEntity.ok(ApiResponse.ok(status));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse<QueueTicketDto>> getOrderTicketDetails(@PathVariable Long id) {
        QueueTicketDto ticket = queueService.getTicketByOrderId(id);
        return ResponseEntity.ok(ApiResponse.ok(ticket));
    }
}
