package com.idms.idms_backend.repository;

import com.idms.idms_backend.entity.Batch;
import com.idms.idms_backend.entity.IdCardType;
import com.idms.idms_backend.entity.Intern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InternRepository extends JpaRepository<Intern, Long> {

    long countByBatch(Batch batch);

    List<Intern> findByBatch(Batch batch);

    @Query("select coalesce(max(i.sequenceNo), 0) from Intern i where i.batch = :batch")
    int findMaxSequenceNo(@Param("batch") Batch batch);

    @Query("""
            select i from Intern i join fetch i.batch b
            where (:name is null or lower(i.name) like lower(concat('%', :name, '%')))
              and (:batchId is null or b.id = :batchId)
              and (:idCardType is null or i.idCardType = :idCardType)
            order by i.id
            """)
    List<Intern> search(@Param("name") String name,
                        @Param("batchId") Long batchId,
                        @Param("idCardType") IdCardType idCardType);
}