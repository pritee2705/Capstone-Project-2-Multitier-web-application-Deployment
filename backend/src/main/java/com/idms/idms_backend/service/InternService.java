package com.idms.idms_backend.service;

import com.idms.idms_backend.dto.InternRequest;
import com.idms.idms_backend.dto.InternResponse;
import com.idms.idms_backend.dto.InternUpdateRequest;
import com.idms.idms_backend.entity.Batch;
import com.idms.idms_backend.entity.IdCardType;
import com.idms.idms_backend.entity.Intern;
import com.idms.idms_backend.exception.ResourceNotFoundException;
import com.idms.idms_backend.repository.BatchRepository;
import com.idms.idms_backend.repository.InternRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InternService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final InternRepository internRepository;
    private final BatchRepository batchRepository;

    @Transactional
    public InternResponse addIntern(InternRequest request) {
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + request.getBatchId()));

        int nextSeq = internRepository.findMaxSequenceNo(batch) + 1;
        if (nextSeq > 999) {
            throw new IllegalArgumentException("Batch is full (max 999 interns)");
        }

        Intern intern = new Intern();
        intern.setName(request.getName());
        intern.setEmail(request.getEmail());
        intern.setMobileNumber(request.getMobileNumber());
        intern.setIdCardType(request.getIdCardType());
        intern.setDateOfJoining(request.getDateOfJoining());
        intern.setBatch(batch);
        intern.setSequenceNo(nextSeq);
        intern.setInternId(generateInternId(request.getIdCardType(), request.getDateOfJoining(), nextSeq));

        return toResponse(internRepository.saveAndFlush(intern));
    }

    @Transactional(readOnly = true)
    public List<InternResponse> search(String name, Long batchId, IdCardType idCardType) {
        String cleanName = (name == null || name.isBlank()) ? null : name.trim();
        return internRepository.search(cleanName, batchId, idCardType).stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InternResponse getIntern(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public InternResponse updateIntern(Long id, InternUpdateRequest request) {
        Intern intern = findOrThrow(id);
        intern.setName(request.getName());
        intern.setEmail(request.getEmail());
        intern.setMobileNumber(request.getMobileNumber());
        return toResponse(internRepository.save(intern));
    }

    @Transactional
    public void deleteIntern(Long id) {
        internRepository.delete(findOrThrow(id));
    }

    private Intern findOrThrow(Long id) {
        return internRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intern not found: " + id));
    }

    private String generateInternId(IdCardType type, java.time.LocalDate joiningDate, int seq) {
        String prefix = (type == IdCardType.PREMIUM) ? "EMP" : "TDA";
        return prefix + joiningDate.format(DATE_FMT) + "-" + String.format("%03d", seq);
    }

    private InternResponse toResponse(Intern i) {
        Batch b = i.getBatch();
        return new InternResponse(
                i.getId(), i.getInternId(), i.getName(), i.getEmail(), i.getMobileNumber(),
                i.getIdCardType(), i.getDateOfJoining(),
                b.getId(), b.getStartDate(), b.getEndDate());
    }
}