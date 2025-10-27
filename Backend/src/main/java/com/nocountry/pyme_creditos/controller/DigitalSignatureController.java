package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.DigitalSignatureRequestDTO;
import com.nocountry.pyme_creditos.dto.DigitalSignatureResponseDTO;
import com.nocountry.pyme_creditos.services.DigitalSignatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/digital_signatures")
@RequiredArgsConstructor
@Slf4j
public class DigitalSignatureController {

    private final DigitalSignatureService digitalSignatureService;

    @PostMapping
    public ResponseEntity<DigitalSignatureResponseDTO> create(@RequestBody DigitalSignatureRequestDTO request) {
        log.info("📬 Nueva solicitud de firma digital para solicitud de credito {}", request.getApplicationId());
        var resp = digitalSignatureService.createEmbeddedSigning(request);
        return ResponseEntity.ok(resp);
    }
}
