package com.smartcanteen.controller;

import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.report.DashboardMetricsDto;
import com.smartcanteen.dto.report.SalesReportDto;
import com.smartcanteen.service.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardMetricsDto>> getDashboardMetrics() {
        DashboardMetricsDto metrics = reportService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.ok(metrics));
    }

    @GetMapping("/sales")
    public ResponseEntity<ApiResponse<List<SalesReportDto>>> getSalesReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<SalesReportDto> report = reportService.getSalesReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(report));
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportCsvReport(
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
}
