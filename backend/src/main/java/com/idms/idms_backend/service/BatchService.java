package com.idms.idms_backend.service;

import com.idms.idms_backend.dto.BatchRequest;
import com.idms.idms_backend.dto.BatchResponse;
import com.idms.idms_backend.entity.Batch;
import com.idms.idms_backend.exception.ResourceNotFoundException;
import com.idms.idms_backend.repository.BatchRepository;
import com.idms.idms_backend.repository.InternRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepository batchRepository;
    private final InternRepository internRepository;

    public BatchResponse createBatch(BatchRequest request) {
        Batch batch = new Batch();
        batch.setStartDate(request.getStartDate());
        batch.setEndDate(request.getStartDate().plusMonths(6));
        return toResponse(batchRepository.save(batch));
    }

    public List<BatchResponse> getAllBatches() {
        return batchRepository.findAll().stream().map(this::toResponse).toList();
    }

    public BatchResponse getBatch(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + id));
        return toResponse(batch);
    }

    private BatchResponse toResponse(Batch batch) {
        return new BatchResponse(
                batch.getId(),
                batch.getStartDate(),
                batch.getEndDate(),
                internRepository.countByBatch(batch));
    }
}