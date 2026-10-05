package com.idms.idms_backend.dto;

import com.idms.idms_backend.entity.IdCardType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class InternRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 150, message = "Email must be at most 150 characters")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be exactly 10 digits")
    private String mobileNumber;

    @NotNull(message = "ID card type is required (FREE or PREMIUM)")
    private IdCardType idCardType;

    @NotNull(message = "Date of joining is required")
    private LocalDate dateOfJoining;

    @NotNull(message = "Batch is required")
    private Long batchId;
}