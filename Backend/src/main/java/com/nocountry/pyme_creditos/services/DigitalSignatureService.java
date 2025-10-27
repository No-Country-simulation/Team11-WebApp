package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.DigitalSignatureRequestDTO;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class DigitalSignatureService {

    private final CreditApplicationRepository appRepo;
    private final UserRepository userRepo;
    private final DigitalSignatureRepository sigRepo;
    private final DocusignClient docusignClient;

    @Transactional
    public DigitalSignatureResponseDTO createSignatureMock(DigitalSignatureRequestDTO req) {
        var app = appRepo.findById(req.getApplicationId())
                .orElseThrow(() -> new IllegalArgumentException("Solicitud de crédito no encontrada"));
        var user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        //Crear registro inicial en BD
        var sig = new DigitalSignature();
        sig.setCompany(app.getCompany());
        sig.setApplication(app);
        sig.setUser(user);
        sig.setProvider("MOCK");
        sig.setStatus("created");
        sigRepo.save(sig);

        //Simular sesión de firma
        var session = docusignClient.createEmbeddedSigning(
                user.getName() + " " + user.getLastName(),
                user.getEmail(),
                user.getId().toString()
        );

        sig.setEnvelopeId(session.envelopeId());
        sig.setSigningUrl(session.signingUrl());
        sig.setStatus("sent");
        sigRepo.save(sig);

        log.info("🖋️ Firma simulada creada para usuario {}", user.getEmail());

        return DigitalSignatureResponseDTO.builder()
                .signatureId(sig.getId())
                .envelopeId(sig.getEnvelopeId())
                .provider(sig.getProvider())
                .signingUrl(sig.getSigningUrl())
                .status(sig.getStatus())
                .build();
    }

    @Transactional
    public void markCompleted(String envelopeId) {
        sigRepo.findByEnvelopeId(envelopeId).ifPresent(sig -> {
            sig.setStatus("completed");
            sig.setCompletedAt(LocalDateTime.now());
            sigRepo.save(sig);
        });
    }
}

