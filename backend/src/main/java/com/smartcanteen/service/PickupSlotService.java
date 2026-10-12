package com.smartcanteen.service;

import com.smartcanteen.dto.slot.PickupSlotDto;
import com.smartcanteen.dto.slot.PickupSlotRequest;
import com.smartcanteen.entity.PickupSlot;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.exception.SlotFullException;
import com.smartcanteen.repository.PickupSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupSlotService {

    private final PickupSlotRepository slotRepository;

    public PickupSlotService(PickupSlotRepository slotRepository) {
        this.slotRepository = slotRepository;
    }

    public List<PickupSlotDto> getActivePickupSlots() {
        return slotRepository.findByActiveTrueOrderByStartTimeAsc().stream()
                .map(PickupSlotDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PickupSlotDto> getAllPickupSlots() {
        return slotRepository.findAll().stream()
                .map(PickupSlotDto::fromEntity)
                .collect(Collectors.toList());
    }

    public PickupSlot getSlotEntity(Long id) {
        return slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + id));
    }

    @Transactional
    public PickupSlotDto createSlot(PickupSlotRequest request) {
        PickupSlot slot = new PickupSlot(
                request.getStartTime(),
                request.getEndTime(),
                request.getMaxOrdersCapacity()
        );
        slot.setSlotDate(request.getSlotDate());
        if (request.getActive() != null) {
            slot.setActive(request.getActive());
        }
        slot = slotRepository.save(slot);
        return PickupSlotDto.fromEntity(slot);
    }

    @Transactional
    public PickupSlotDto updateSlot(Long id, PickupSlotRequest request) {
        PickupSlot slot = getSlotEntity(id);
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setSlotDate(request.getSlotDate());
        slot.setMaxOrdersCapacity(request.getMaxOrdersCapacity());
        if (request.getActive() != null) {
            slot.setActive(request.getActive());
        }
        slot = slotRepository.save(slot);
        return PickupSlotDto.fromEntity(slot);
    }

    @Transactional
    public void reserveSlot(Long slotId) {
        int updated = slotRepository.reserveSlotAtomic(slotId);
        if (updated == 0) {
            throw new SlotFullException("The selected pickup slot is fully booked or inactive. Please select another slot.");
        }
    }

    @Transactional
    public void releaseSlot(Long slotId) {
        if (slotId != null) {
            slotRepository.releaseSlotAtomic(slotId);
        }
    }
}
