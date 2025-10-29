package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.DigitalSignatureResponseDTO;
import com.nocountry.pyme_creditos.model.DigitalSignature;
import com.nocountry.pyme_creditos.repository.CreditApplicationRepository;
import com.nocountry.pyme_creditos.repository.DigitalSignatureRepository;
import com.nocountry.pyme_creditos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DigitalSignatureService {

    private final CreditApplicationRepository appRepo;
    private final UserRepository userRepo;
    private final DigitalSignatureRepository sigRepo;
    private final DocuSignClient docusignClient;

    @Transactional
    public DigitalSignatureResponseDTO createSignatureMock(UUID appId, UUID userId) {
        var app = appRepo.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud de crédito no encontrada"));
        var user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Crear registro (status created)
        var sig = new DigitalSignature(app, user, "MOCK");
        sigRepo.save(sig);

        // Simular sesión de firma y actualizar (status sent)
        var session = docusignClient.createEmbeddedSigning(
                user.getName() + " " + user.getLastName(),
                user.getEmail(),
                user.getId().toString()
        );

        sig.setEnvelopeId(session.envelopeId());
        sig.setSigningUrl(session.signingUrl());
        sig.setStatus("sent");
        sigRepo.save(sig);

        return DigitalSignatureResponseDTO.builder()
                .signatureId(sig.getId())
                .envelopeId(sig.getEnvelopeId())
                .signingUrl(sig.getSigningUrl())
                .status(sig.getStatus())
                .provider(sig.getProvider())
                .build();
    }

    @Transactional
    public void markCompleted(String envelopeId, String documentRef) {
        var sig = sigRepo.findByEnvelopeId(envelopeId)
                .orElseThrow(() -> new IllegalArgumentException("Envelope no encontrado: " + envelopeId));

        sig.setStatus("completed");
        sig.setCompletedAt(LocalDateTime.now());
        if (documentRef != null && !documentRef.isBlank()) {
            sig.setSignatureDocument(documentRef);
        }
        sigRepo.save(sig);
    }
}

