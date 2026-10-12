package com.smartcanteen.service;

import com.smartcanteen.dto.menu.*;
import com.smartcanteen.entity.Category;
import com.smartcanteen.entity.FoodItem;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.exception.InsufficientStockException;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.repository.CategoryRepository;
import com.smartcanteen.repository.FoodItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final FoodItemRepository foodItemRepository;
    private final CategoryRepository categoryRepository;

    public MenuService(FoodItemRepository foodItemRepository, CategoryRepository categoryRepository) {
        this.foodItemRepository = foodItemRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category with name '" + request.getName() + "' already exists");
        }
        Category category = new Category(request.getName(), request.getDescription(), request.getDisplayOrder());
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }
        category = categoryRepository.save(category);
        return CategoryDto.fromEntity(category);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) {
            category.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }
        category = categoryRepository.save(category);
        return CategoryDto.fromEntity(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setActive(false);
        categoryRepository.save(category);
    }

    public List<FoodItemDto> getMenuItems(Long categoryId, Boolean isVegetarian, String search) {
        return foodItemRepository.searchItems(categoryId, isVegetarian, search).stream()
                .map(FoodItemDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FoodItemDto> getAllMenuItemsAdmin() {
        return foodItemRepository.findAll().stream()
                .map(FoodItemDto::fromEntity)
                .collect(Collectors.toList());
    }

    public FoodItemDto getMenuItemById(Long id) {
        FoodItem item = getFoodItemEntity(id);
        return FoodItemDto.fromEntity(item);
    }

    public FoodItem getFoodItemEntity(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
    }

    @Transactional
    public FoodItemDto createMenuItem(FoodItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        FoodItem item = new FoodItem(
                request.getName(),
                request.getDescription(),
                category,
                request.getPrice(),
                request.getImageUrl(),
                request.getStockQuantity(),
                request.getAvailable() != null ? request.getAvailable() : true,
                request.getPreparationTimeMinutes(),
                request.getVegetarian() != null ? request.getVegetarian() : true
        );
        item = foodItemRepository.save(item);
        return FoodItemDto.fromEntity(item);
    }

    @Transactional
    public FoodItemDto updateMenuItem(Long id, FoodItemRequest request) {
        FoodItem item = getFoodItemEntity(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(category);
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setStockQuantity(request.getStockQuantity());
        if (request.getAvailable() != null) {
            item.setAvailable(request.getAvailable());
        }
        item.setPreparationTimeMinutes(request.getPreparationTimeMinutes());
        if (request.getVegetarian() != null) {
            item.setVegetarian(request.getVegetarian());
        }

        item = foodItemRepository.save(item);
        return FoodItemDto.fromEntity(item);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        FoodItem item = getFoodItemEntity(id);
        item.setAvailable(false);
        foodItemRepository.save(item);
    }

    @Transactional
    public void deductStock(Long id, int quantity) {
        int updated = foodItemRepository.decrementStockAtomic(id, quantity);
        if (updated == 0) {
            FoodItem item = getFoodItemEntity(id);
            throw new InsufficientStockException("Insufficient stock for item: " + item.getName() + " (Available: " + item.getStockQuantity() + ")");
        }
    }

    @Transactional
    public void restoreStock(Long id, int quantity) {
        foodItemRepository.incrementStockAtomic(id, quantity);
    }
}
