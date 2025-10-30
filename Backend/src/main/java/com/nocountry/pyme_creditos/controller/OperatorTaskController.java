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

    //Aprovar credito, solo en revision y pendiente
}
