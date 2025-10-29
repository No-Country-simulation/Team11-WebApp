package com.nocountry.pyme_creditos.services;

import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class DocuSignClient {

    @Value("${docusign.mode:MOCK}")
    private String mode;

    public record SigningSession(String envelopeId, String signingUrl) {}

    public String getProviderName() {
        return "REAL".equalsIgnoreCase(mode) ? "DOCUSIGN" : "MOCK";
    }

    // Simula la creación de una sesión de firma
    public SigningSession createEmbeddedSigning(String signerName, String signerEmail, String clientUserId) {
        if ("REAL".equalsIgnoreCase(mode)) {
            // más adelante se implementaría la conexión real
            throw new UnsupportedOperationException("Modo REAL no configurado");
        }

        String envelopeId = "mock-env-" + System.currentTimeMillis();
        String signingUrl = "https://mock-sign.docusign.local/sign?envelopeId=" + envelopeId + "&user=" + clientUserId;

        log.info("📄 [MOCK DOCUSIGN] Simulando envelope={} para {}", envelopeId, signerEmail);
        return new SigningSession(envelopeId, signingUrl);
    }
}