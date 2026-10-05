package com.idms.idms_backend.controller;

import com.idms.idms_backend.dto.BatchRequest;

import com.idms.idms_backend.dto.InternResponse;
import com.idms.idms_backend.service.InternService;

import com.idms.idms_backend.dto.BatchResponse;
import com.idms.idms_backend.service.BatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;
    private final InternService internService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BatchResponse create(@Valid @RequestBody BatchRequest request) {
        return batchService.createBatch(request);
    }

    @GetMapping
    public List<BatchResponse> getAll() {
        return batchService.getAllBatches();
    }

    @GetMapping("/{id}")
    public BatchResponse getOne(@PathVariable Long id) {
        return batchService.getBatch(id);
    }
    
    @GetMapping("/{id}/interns")
    public List<InternResponse> getBatchInterns(@PathVariable Long id) {
        batchService.getBatch(id); // throws 404 if the batch doesn't exist
        return internService.search(null, id, null);
    }
}