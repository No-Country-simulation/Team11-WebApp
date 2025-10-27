package com.nocountry.pyme_creditos.repository;

import com.nocountry.pyme_creditos.model.DigitalSignature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DigitalSignatureRepository extends JpaRepository<DigitalSignature, UUID> {
    Optional<DigitalSignature> findByEnvelopeId(String envelopeId);
    List<DigitalSignature> findByApplicationIdOrderByCreatedAtDesc(UUID applicationId);
}
