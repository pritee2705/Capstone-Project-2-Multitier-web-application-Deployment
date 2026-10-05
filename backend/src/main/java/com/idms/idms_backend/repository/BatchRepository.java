package com.idms.idms_backend.repository;

import com.idms.idms_backend.entity.Batch;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {
}