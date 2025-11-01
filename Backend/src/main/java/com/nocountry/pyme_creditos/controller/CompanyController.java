package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.CompanyRequestDTO;
import com.nocountry.pyme_creditos.dto.CompanyResponseDTO;
import com.nocountry.pyme_creditos.dto.CompanyUpdateDTO;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.UserRepository;
import com.nocountry.pyme_creditos.security.SecurityUtils;
import com.nocountry.pyme_creditos.services.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompanyController {

    private final CompanyService companyService;
    private final SecurityUtils securityUtils;

    // ✅ Crear empresa solo si no existe
    @PostMapping
    public ResponseEntity<CompanyResponseDTO> createCompany(
            @Valid @RequestBody CompanyRequestDTO requestDTO) {

        UUID userId = securityUtils.getCurrentUserId();
        if (companyService.userHasCompany(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        CompanyResponseDTO response = companyService.createCompany(requestDTO, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ✅ Obtener la empresa del usuario
    @GetMapping("/my-company")
    public ResponseEntity<CompanyResponseDTO> getMyCompany() {
        UUID userId = securityUtils.getCurrentUserId();
        CompanyResponseDTO response = companyService.getMyCompany(userId);
        return ResponseEntity.ok(response);
    }

    // ✅ Actualizar la empresa del usuario
    @PutMapping
    public ResponseEntity<CompanyResponseDTO> updateMyCompany(
            @Valid @RequestBody CompanyUpdateDTO updateDTO) {

        UUID userId = securityUtils.getCurrentUserId();
        CompanyResponseDTO response = companyService.updateCompanyByUser(updateDTO, userId);
        return ResponseEntity.ok(response);
    }

    // ✅ Eliminar la empresa del usuario
    @DeleteMapping
    public ResponseEntity<Void> deleteMyCompany() {
        UUID userId = securityUtils.getCurrentUserId();
        companyService.deleteCompanyByUser(userId);
        return ResponseEntity.noContent().build();
    }
}
