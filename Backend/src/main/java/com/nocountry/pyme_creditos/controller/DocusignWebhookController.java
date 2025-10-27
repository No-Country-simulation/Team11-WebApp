package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.services.DigitalSignatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/webhooks/docusign")
@RequiredArgsConstructor
@Slf4j
public class DocusignWebhookController {

    private final DigitalSignatureService signatureService;

    @PostMapping
    public ResponseEntity<String> markCompleted(@RequestBody Map<String, Object> body) {
        String envelopeId = (String) body.get("envelopeId");
        String status = (String) body.getOrDefault("status", "completed");

        signatureService.markCompleted(envelopeId);
        log.info("✅ Firma mock completada: envelope {}", envelopeId);

        return ResponseEntity.ok("OK");
    }
}
