package com.idms.idms_backend.controller;

import com.idms.idms_backend.dto.InternRequest;
import com.idms.idms_backend.dto.InternResponse;
import com.idms.idms_backend.dto.InternUpdateRequest;
import com.idms.idms_backend.entity.IdCardType;
import com.idms.idms_backend.service.InternService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interns")
@RequiredArgsConstructor
public class InternController {

    private final InternService internService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InternResponse create(@Valid @RequestBody InternRequest request) {
        return internService.addIntern(request);
    }

    @GetMapping
    public List<InternResponse> search(@RequestParam(required = false) String name,
                                       @RequestParam(required = false) Long batchId,
                                       @RequestParam(required = false) IdCardType idCardType) {
        return internService.search(name, batchId, idCardType);
    }

    @GetMapping("/{id}")
    public InternResponse getOne(@PathVariable Long id) {
        return internService.getIntern(id);
    }

    @PutMapping("/{id}")
    public InternResponse update(@PathVariable Long id, @Valid @RequestBody InternUpdateRequest request) {
        return internService.updateIntern(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        internService.deleteIntern(id);
    }
}