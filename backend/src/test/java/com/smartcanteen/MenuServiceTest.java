package com.smartcanteen;

import com.smartcanteen.entity.Category;
import com.smartcanteen.entity.FoodItem;
import com.smartcanteen.exception.InsufficientStockException;
import com.smartcanteen.repository.CategoryRepository;
import com.smartcanteen.repository.FoodItemRepository;
import com.smartcanteen.service.MenuService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private FoodItemRepository foodItemRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private MenuService menuService;

    private FoodItem sampleItem;

    @BeforeEach
    void setUp() {
        Category cat = new Category("Breakfast", "Morning meals", 1);
        cat.setId(1L);
        sampleItem = new FoodItem("Masala Dosa", "Crispy dosa", cat, new BigDecimal("60.00"), "url", 10, true, 8, true);
        sampleItem.setId(10L);
    }

    @Test
    void testDeductStockSuccess() {
        when(foodItemRepository.decrementStockAtomic(10L, 2)).thenReturn(1);

        assertDoesNotThrow(() -> menuService.deductStock(10L, 2));
        verify(foodItemRepository, times(1)).decrementStockAtomic(10L, 2);
    }

    @Test
    void testDeductStockThrowsInsufficientStockException() {
        when(foodItemRepository.decrementStockAtomic(10L, 15)).thenReturn(0);
        when(foodItemRepository.findById(10L)).thenReturn(Optional.of(sampleItem));

        assertThrows(InsufficientStockException.class, () -> menuService.deductStock(10L, 15));
    }

    @Test
    void testRestoreStock() {
        when(foodItemRepository.incrementStockAtomic(10L, 3)).thenReturn(1);
        menuService.restoreStock(10L, 3);
        verify(foodItemRepository, times(1)).incrementStockAtomic(10L, 3);
    }
}
