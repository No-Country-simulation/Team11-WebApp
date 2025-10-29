package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.CreditApplicationResponseDTO;
import com.nocountry.pyme_creditos.dto.OperatorTaskDTO;
import com.nocountry.pyme_creditos.dto.StatusUpdateRequestDTO;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.enums.TaskStatus;
import com.nocountry.pyme_creditos.services.CreditApplicationService;
import com.nocountry.pyme_creditos.services.OperatorTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/operator")
@PreAuthorize("hasRole('OPERATOR')")
public class OperatorTaskController {

    private final OperatorTaskService operatorTaskService;
    private final CreditApplicationService creditApplicationService;

    // ✅ GET - Tareas por estado de crédito y tarea
    @GetMapping("/tasks")
    public ResponseEntity<List<OperatorTaskDTO>> getTasks(
            @RequestParam(required = false) CreditStatus creditStatus,
            @RequestParam(required = false) TaskStatus taskStatus) {
        return ResponseEntity.ok(operatorTaskService.getTasks(creditStatus, taskStatus));
    }

    // ✅ GET - Tarea específica
    @GetMapping("/{taskId}")
    public ResponseEntity<OperatorTaskDTO> getTaskById(@PathVariable UUID taskId) {
        return ResponseEntity.ok(operatorTaskService.getTaskById(taskId));
    }

    // ✅ PUT - Actualizar estado de aplicación
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<CreditApplicationResponseDTO> updateApplicationStatus(
            @PathVariable UUID applicationId,
            @Valid @RequestBody StatusUpdateRequestDTO requestDTO) {
        return ResponseEntity.ok(
                creditApplicationService.updateApplicationStatus(applicationId, requestDTO)
        );
    }

    // ✅ GET - Aplicaciones para revisión
    @GetMapping("/applications/for-review")
    public ResponseEntity<List<CreditApplicationResponseDTO>> getApplicationsForReview() {
        return ResponseEntity.ok(creditApplicationService.getApplicationsForReview());
    }
}
