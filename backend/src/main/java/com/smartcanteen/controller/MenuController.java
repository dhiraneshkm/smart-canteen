package com.smartcanteen.controller;

import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.menu.FoodItemDto;
import com.smartcanteen.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodItemDto>>> getMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean isVegetarian,
            @RequestParam(required = false) String search) {
        List<FoodItemDto> items = menuService.getMenuItems(categoryId, isVegetarian, search);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodItemDto>> getMenuItemById(@PathVariable Long id) {
        FoodItemDto item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.ok(item));
    }
}
