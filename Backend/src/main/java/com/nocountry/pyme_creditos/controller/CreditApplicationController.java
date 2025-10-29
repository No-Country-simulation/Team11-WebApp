package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.CreditApplicationRequestDTO;
import com.nocountry.pyme_creditos.dto.CreditApplicationResponseDTO;
import com.nocountry.pyme_creditos.dto.DigitalConsentRequestDTO;
import com.nocountry.pyme_creditos.dto.StatusUpdateRequestDTO;
import com.nocountry.pyme_creditos.enums.CreditStatus;
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

        // ✅ Obtenemos el usuario autenticado
        UUID userId = securityUtils.getCurrentUserId();



        CreditApplicationResponseDTO response = creditApplicationService.createApplication(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/signature")
    public ResponseEntity<CreditApplicationResponseDTO> attachSignature(
            @PathVariable UUID id,
            @Valid @RequestBody DigitalConsentRequestDTO request) {

        UUID userId = securityUtils.getCurrentUserId();
        CreditApplicationResponseDTO response = creditApplicationService.attachSignature(id, userId, request);
        return ResponseEntity.ok(response);
    }

    // ✅ SUBMIT - Cliente envía aplicación (SAVE → PENDING)
    @PostMapping("/{id}/submit")
    public ResponseEntity<CreditApplicationResponseDTO> submitApplication(
            @PathVariable UUID id) {

        CreditApplicationResponseDTO response = creditApplicationService.submitApplication(id);
        return ResponseEntity.ok(response);
    }

    // 🟢 GET - Cliente ve todas las aplicaciones de SU compañía
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

    // ✅ PUT - Cliente actualiza su aplicación (solo en estado SAVE)
    @PutMapping("/{id}")
    public ResponseEntity<CreditApplicationResponseDTO> updateApplication(
            @PathVariable UUID id,
            @Valid @RequestBody CreditApplicationRequestDTO requestDTO) {

        CreditApplicationResponseDTO response = creditApplicationService.updateApplication(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    // ✅ DELETE - Cliente elimina su aplicación (solo en estado SAVE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable UUID id) {

        creditApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

  /*  // ✅ GET - Operador ve TODAS las aplicaciones PENDIENTES
    @GetMapping("/pending")
    @PreAuthorize("hasRole('OPERATOR')") // Solo operadores
    public ResponseEntity<List<CreditApplicationResponseDTO>> getPendingApplications() {

        List<CreditApplicationResponseDTO> responses = creditApplicationService.getApplicationsByStatus(CreditStatus.PENDING);
        return ResponseEntity.ok(responses);
    }

    // ✅ GET - Operador ve aplicaciones EN REVISIÓN
    @GetMapping("/under-review")
    @PreAuthorize("hasRole('OPERATOR')")
    public ResponseEntity<List<CreditApplicationResponseDTO>> getUnderReviewApplications() {

        List<CreditApplicationResponseDTO> responses = creditApplicationService.getApplicationsByStatus(CreditStatus.UNDER_REVIEW);
        return ResponseEntity.ok(responses);
    }

    // ✅ GET - Operador ve aplicación específica
    @GetMapping("/{id}")
    public ResponseEntity<CreditApplicationResponseDTO> getApplication(
            @PathVariable UUID id) {

        CreditApplicationResponseDTO response = creditApplicationService.getApplicationById(id);
        return ResponseEntity.ok(response);
    }

    // ✅ PUT - Operador actualiza estado (PENDING → UNDER_REVIEW → APPROVED/REJECTED)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OPERATOR')")
    public ResponseEntity<CreditApplicationResponseDTO> updateApplicationStatus(
            @PathVariable UUID id,
            @Valid @RequestBody StatusUpdateRequestDTO requestDTO) {

        CreditApplicationResponseDTO response = creditApplicationService.updateApplicationStatus(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    // ✅ GET - Operador ve aplicaciones para revisión (dashboard)
    @GetMapping("/for-review")
    @PreAuthorize("hasRole('OPERATOR')")
    public ResponseEntity<List<CreditApplicationResponseDTO>> getApplicationsForReview() {

        List<CreditApplicationResponseDTO> responses = creditApplicationService.getApplicationsForReview();
        return ResponseEntity.ok(responses);
    }*/



    /*// ✅ GET - Cliente ve aplicaciones por compañía
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<CreditApplicationResponseDTO>> getApplicationsByCompany(
            @PathVariable UUID companyId) {

        List<CreditApplicationResponseDTO> responses = creditApplicationService.getApplicationsByCompany(companyId);
        return ResponseEntity.ok(responses);
    }*/
}