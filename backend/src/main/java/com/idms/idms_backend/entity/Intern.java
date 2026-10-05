package com.idms.idms_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "interns")
@Getter
@Setter
@NoArgsConstructor
public class Intern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "intern_id", nullable = false, unique = true, updatable = false, length = 20)
    private String internId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "id_card_type", nullable = false)
    private IdCardType idCardType;

    @Column(name = "date_of_joining", nullable = false)
    private LocalDate dateOfJoining;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @Column(name = "sequence_no", nullable = false, updatable = false)
    private Integer sequenceNo;
}