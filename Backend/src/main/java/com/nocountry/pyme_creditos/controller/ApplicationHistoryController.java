package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.model.ApplicationHistory;
import com.nocountry.pyme_creditos.services.ApplicationHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/application-history")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationHistoryController {

    private final ApplicationHistoryService applicationHistoryService;

    // ✅ GET - Obtener historial de una aplicación
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<ApplicationHistory>> getApplicationHistory(
            @PathVariable UUID applicationId) {

        List<ApplicationHistory> history = applicationHistoryService.getApplicationHistory(applicationId);
        return ResponseEntity.ok(history);
    }

    // ✅ GET - Obtener historial de acciones de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationHistory>> getUserHistory(
            @PathVariable UUID userId) {

        // Nota: Necesitarías agregar este método al servicio
        // List<ApplicationHistory> history = applicationHistoryService.getUserHistory(userId);
        return ResponseEntity.ok().build();
    }
}