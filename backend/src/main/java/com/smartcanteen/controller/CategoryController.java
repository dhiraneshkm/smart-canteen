package com.smartcanteen.controller;

import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.menu.CategoryDto;
import com.smartcanteen.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final MenuService menuService;

    public CategoryController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        List<CategoryDto> categories = menuService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }
}
