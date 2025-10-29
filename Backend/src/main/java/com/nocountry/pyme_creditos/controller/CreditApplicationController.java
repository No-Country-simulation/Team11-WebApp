package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.*;

import com.nocountry.pyme_creditos.security.SecurityUtils;
import com.nocountry.pyme_creditos.services.CompanyService;
import com.nocountry.pyme_creditos.services.CreditApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/credit-applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CreditApplicationController {

    private final CreditApplicationService creditApplicationService;
    private final SecurityUtils securityUtils;
    private final CompanyService companyService;

    // ✅ CREATE - Cliente crea aplicación (estado SAVE)
    @PostMapping
    public ResponseEntity<CreditApplicationResponseDTO> createApplication(
            @Valid @RequestBody CreditApplicationRequestDTO requestDTO) {

        CreditApplicationResponseDTO response = creditApplicationService.createApplication(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/signature")
    public ResponseEntity<DigitalSignatureResponseDTO> attachSignature(
            @PathVariable UUID id,
            @Valid @RequestBody DigitalConsentRequestDTO request) {

        UUID userId = securityUtils.getCurrentUserId();
        DigitalSignatureResponseDTO response = creditApplicationService.attachSignature(id, userId, request);
        return ResponseEntity.ok(response);
    }


    // ✅ SUBMIT - Cliente envía aplicación (SAVE → PENDING)
    @PostMapping("/{id}/submit")
    public ResponseEntity<CreditApplicationResponseDTO> submitApplication(@PathVariable UUID id) {
        CreditApplicationResponseDTO response = creditApplicationService.submitApplication(id);
        return ResponseEntity.ok(response);
    }

    // ✅ GET - Cliente ve todas las aplicaciones de SU compañía
    @GetMapping("/company")
    public ResponseEntity<List<CreditApplicationResponseDTO>> getCompanyApplications() {
        UUID companyId = getCompanyIdFromAuthenticatedUser();
        List<CreditApplicationResponseDTO> responses = creditApplicationService.getApplicationsByCompany(companyId);
        return ResponseEntity.ok(responses);
    }

    private UUID getCompanyIdFromAuthenticatedUser() {
        UUID userId = securityUtils.getCurrentUserId();
        return companyService.getMyCompany(userId).getId();
    }

    // ✅ PATCH - Cliente actualiza su aplicación (solo SAVE)
    @PatchMapping("/{id}")
    public ResponseEntity<CreditApplicationResponseDTO> updateApplication(
            @PathVariable UUID id,
            @RequestBody CreditApplicationUpdateDTO requestDTO) {

        CreditApplicationResponseDTO response = creditApplicationService.updateApplicationPartial(id, requestDTO);
        return ResponseEntity.ok(response);
    }


    // ✅ DELETE - Cliente elimina su aplicación (solo SAVE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable UUID id) {
        creditApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
