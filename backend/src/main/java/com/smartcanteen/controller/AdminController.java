package com.smartcanteen.controller;

import com.smartcanteen.dto.audit.AuditLogDto;
import com.smartcanteen.dto.auth.UserProfileDto;
import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.menu.*;
import com.smartcanteen.dto.order.OrderDto;
import com.smartcanteen.dto.report.DashboardMetricsDto;
import com.smartcanteen.dto.report.SalesReportDto;
import com.smartcanteen.dto.slot.PickupSlotDto;
import com.smartcanteen.dto.slot.PickupSlotRequest;
import com.smartcanteen.entity.User;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.repository.UserRepository;
import com.smartcanteen.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ReportService reportService;
    private final OrderService orderService;
    private final MenuService menuService;
    private final PickupSlotService pickupSlotService;
    private final AuditLogService auditLogService;
    private final AuthService authService;
    private final UserRepository userRepository;

    public AdminController(ReportService reportService,
                           OrderService orderService,
                           MenuService menuService,
                           PickupSlotService pickupSlotService,
                           AuditLogService auditLogService,
                           AuthService authService,
                           UserRepository userRepository) {
        this.reportService = reportService;
        this.orderService = orderService;
        this.menuService = menuService;
        this.pickupSlotService = pickupSlotService;
        this.auditLogService = auditLogService;
        this.authService = authService;
        this.userRepository = userRepository;
    }

    private User getAdminUser(Authentication auth) {
        return authService.getCurrentUserEntity(auth.getName());
    }

    // Dashboard Analytics
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardMetricsDto>> getDashboardMetrics() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getDashboardMetrics()));
    }

    // Orders Management
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAllOrdersAdmin()));
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileDto>>> getAllUsers() {
        List<UserProfileDto> users = userRepository.findAll().stream()
                .map(UserProfileDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserProfileDto>> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            Authentication auth,
            HttpServletRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        boolean enabled = body.getOrDefault("enabled", !user.isEnabled());
        user.setEnabled(enabled);
        user = userRepository.save(user);

        auditLogService.recordLog(
                getAdminUser(auth),
                "TOGGLE_USER_STATUS",
                "User",
                String.valueOf(id),
                "Set user enabled to: " + enabled,
                request.getRemoteAddr()
        );

        return ResponseEntity.ok(ApiResponse.ok("User status updated", UserProfileDto.fromEntity(user)));
    }

    // Category CRUD
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
            @Valid @RequestBody CategoryRequest body,
            Authentication auth,
            HttpServletRequest request) {
        CategoryDto dto = menuService.createCategory(body);
        auditLogService.recordLog(getAdminUser(auth), "CREATE_CATEGORY", "Category", String.valueOf(dto.getId()), "Created category: " + dto.getName(), request.getRemoteAddr());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Category created", dto));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest body,
            Authentication auth,
            HttpServletRequest request) {
        CategoryDto dto = menuService.updateCategory(id, body);
        auditLogService.recordLog(getAdminUser(auth), "UPDATE_CATEGORY", "Category", String.valueOf(id), "Updated category: " + dto.getName(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Category updated", dto));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(
            @PathVariable Long id,
            Authentication auth,
            HttpServletRequest request) {
        menuService.deleteCategory(id);
        auditLogService.recordLog(getAdminUser(auth), "DELETE_CATEGORY", "Category", String.valueOf(id), "Deactivated category id: " + id, request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Category deactivated", null));
    }

    // Menu CRUD
    @GetMapping("/menu")
    public ResponseEntity<ApiResponse<List<FoodItemDto>>> getAllMenuItems() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllMenuItemsAdmin()));
    }

    @PostMapping("/menu")
    public ResponseEntity<ApiResponse<FoodItemDto>> createMenuItem(
            @Valid @RequestBody FoodItemRequest body,
            Authentication auth,
            HttpServletRequest request) {
        FoodItemDto dto = menuService.createMenuItem(body);
        auditLogService.recordLog(getAdminUser(auth), "CREATE_FOOD_ITEM", "FoodItem", String.valueOf(dto.getId()), "Created food item: " + dto.getName(), request.getRemoteAddr());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Food item created", dto));
    }

    @PutMapping("/menu/{id}")
    public ResponseEntity<ApiResponse<FoodItemDto>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody FoodItemRequest body,
            Authentication auth,
            HttpServletRequest request) {
        FoodItemDto dto = menuService.updateMenuItem(id, body);
        auditLogService.recordLog(getAdminUser(auth), "UPDATE_FOOD_ITEM", "FoodItem", String.valueOf(id), "Updated food item: " + dto.getName(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Food item updated", dto));
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMenuItem(
            @PathVariable Long id,
            Authentication auth,
            HttpServletRequest request) {
        menuService.deleteMenuItem(id);
        auditLogService.recordLog(getAdminUser(auth), "DELETE_FOOD_ITEM", "FoodItem", String.valueOf(id), "Deactivated food item id: " + id, request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Food item deactivated", null));
    }

    // Pickup Slot CRUD
    @GetMapping("/pickup-slots")
    public ResponseEntity<ApiResponse<List<PickupSlotDto>>> getAllSlots() {
        return ResponseEntity.ok(ApiResponse.ok(pickupSlotService.getAllPickupSlots()));
    }

    @PostMapping("/pickup-slots")
    public ResponseEntity<ApiResponse<PickupSlotDto>> createSlot(
            @Valid @RequestBody PickupSlotRequest body,
            Authentication auth,
            HttpServletRequest request) {
        PickupSlotDto dto = pickupSlotService.createSlot(body);
        auditLogService.recordLog(getAdminUser(auth), "CREATE_PICKUP_SLOT", "PickupSlot", String.valueOf(dto.getId()), "Created slot: " + dto.getLabel(), request.getRemoteAddr());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Pickup slot created", dto));
    }

    @PutMapping("/pickup-slots/{id}")
    public ResponseEntity<ApiResponse<PickupSlotDto>> updateSlot(
            @PathVariable Long id,
            @Valid @RequestBody PickupSlotRequest body,
            Authentication auth,
            HttpServletRequest request) {
        PickupSlotDto dto = pickupSlotService.updateSlot(id, body);
        auditLogService.recordLog(getAdminUser(auth), "UPDATE_PICKUP_SLOT", "PickupSlot", String.valueOf(id), "Updated slot: " + dto.getLabel(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Pickup slot updated", dto));
    }

    // Reports
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<SalesReportDto>>> getReports(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getSalesReport(startDate, endDate)));
    }

    @GetMapping("/reports/export")
    public ResponseEntity<InputStreamResource> exportReportsCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        ByteArrayInputStream in = reportService.exportReportsCsv(startDate, endDate);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=canteen-sales-report.csv");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }

    // Audit Logs
    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.ok(auditLogService.getAllLogs()));
    }
}
