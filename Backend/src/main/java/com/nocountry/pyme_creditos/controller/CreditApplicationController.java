package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.CreditApplicationRequestDTO;
import com.nocountry.pyme_creditos.dto.CreditApplicationResponseDTO;
import com.nocountry.pyme_creditos.dto.StatusUpdateRequestDTO;
import com.nocountry.pyme_creditos.enums.CreditStatus;
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

    // ✅ CREATE - Cliente crea aplicación (estado SAVE)
    @PostMapping
    public ResponseEntity<CreditApplicationResponseDTO> createApplication(
            @Valid @RequestBody CreditApplicationRequestDTO requestDTO) {

        CreditApplicationResponseDTO response = creditApplicationService.createApplication(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ✅ SUBMIT - Cliente envía aplicación (SAVE → PENDING)
    @PostMapping("/{id}/submit")
    public ResponseEntity<CreditApplicationResponseDTO> submitApplication(
            @PathVariable UUID id) {

        CreditApplicationResponseDTO response = creditApplicationService.submitApplication(id);
        return ResponseEntity.ok(response);
    }

    // ✅ GET - Cliente ve SUS aplicaciones
    @GetMapping("/my-applications")
    public ResponseEntity<List<CreditApplicationResponseDTO>> getMyApplications() {
        // Necesitarías implementar este método en el servicio
        // List<CreditApplicationResponseDTO> responses = creditApplicationService.getMyApplications();
        return ResponseEntity.ok().build();
    }

    // ✅ GET - Operador ve TODAS las aplicaciones PENDIENTES
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

    // ✅ GET - Cliente ve aplicaciones por compañía
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<CreditApplicationResponseDTO>> getApplicationsByCompany(
            @PathVariable UUID companyId) {

        List<CreditApplicationResponseDTO> responses = creditApplicationService.getApplicationsByCompany(companyId);
        return ResponseEntity.ok(responses);
    }
}