package com.idms.idms_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BatchRequest {

    @NotNull(message = "Start date is required")
    private LocalDate startDate;
}