package com.smartcanteen.repository;

import com.smartcanteen.entity.QueueTicket;
import com.smartcanteen.entity.QueueTicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTicketRepository extends JpaRepository<QueueTicket, Long> {

    Optional<QueueTicket> findByTicketNumber(String ticketNumber);

    Optional<QueueTicket> findByOrderId(Long orderId);

    List<QueueTicket> findByStatusInOrderByQueuePositionAsc(List<QueueTicketStatus> statuses);

    long countByStatusIn(List<QueueTicketStatus> statuses);

    @Query("SELECT COUNT(t) FROM QueueTicket t WHERE t.status IN ('WAITING', 'PREPARING')")
    long countActiveTickets();

    @Query("SELECT COALESCE(MAX(t.id), 0) FROM QueueTicket t")
    long getMaxTicketId();
}
