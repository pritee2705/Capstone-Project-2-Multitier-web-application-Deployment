package com.idms.idms_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class BatchResponse {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalInterns;
}