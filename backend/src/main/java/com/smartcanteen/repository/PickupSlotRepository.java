package com.smartcanteen.repository;

import com.smartcanteen.entity.PickupSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickupSlotRepository extends JpaRepository<PickupSlot, Long> {

    List<PickupSlot> findByActiveTrueOrderByStartTimeAsc();

    @Modifying
    @Query("UPDATE PickupSlot s SET s.currentBookedCount = s.currentBookedCount + 1 WHERE s.id = :id AND s.currentBookedCount < s.maxOrdersCapacity AND s.active = true")
    int reserveSlotAtomic(@Param("id") Long id);

    @Modifying
    @Query("UPDATE PickupSlot s SET s.currentBookedCount = s.currentBookedCount - 1 WHERE s.id = :id AND s.currentBookedCount > 0")
    int releaseSlotAtomic(@Param("id") Long id);
}
