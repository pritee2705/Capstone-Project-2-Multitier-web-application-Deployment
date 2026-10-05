package com.idms.idms_backend.dto;

import com.idms.idms_backend.entity.IdCardType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class InternResponse {
    private Long id;
    private String internId;
    private String name;
    private String email;
    private String mobileNumber;
    private IdCardType idCardType;
    private LocalDate dateOfJoining;
    private Long batchId;
    private LocalDate batchStartDate;
    private LocalDate batchEndDate;
}