package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.CompanyRequestDTO;
import com.nocountry.pyme_creditos.dto.CompanyResponseDTO;
import com.nocountry.pyme_creditos.dto.CompanyUpdateDTO;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.UserRepository;
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
//comani  "id": "5f5f5115-abed-4358-93ea-8a4bb8d6d64a",
//    "userId": "11111111-1111-1111-1111-111111111111",
 //usrr
@RestController
@RequestMapping("/api/companies")//endpoint revisado en postman
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompanyController {
//, "/api/companies", "/api/companies/{id}", "/api/companies/my-companies"
    private final CompanyService companyService;
    private final UserRepository userRepository; // ✅ INYECTA UserRepository

    // ✅ MÉTODO para obtener userId desde sesión
    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // Obtiene el email del usuario autenticado

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return user.getId();
    }


   /* // ✅ MeTODO HELPER - Obtener ID del usuario autenticado
    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getId();
    }*/

    // ✅ POST - Crear nueva empresa
    @PostMapping//endpoint revisado en postman
    public ResponseEntity<CompanyResponseDTO> createCompany(
            @Valid @RequestBody CompanyRequestDTO requestDTO)
           {

        CompanyResponseDTO response = companyService.createCompany(requestDTO, getCurrentUserId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ✅ GET - Obtener empresa por ID
    @GetMapping("/{id}")                         //endpoint revisado en postman
    public ResponseEntity<CompanyResponseDTO> getCompany(@PathVariable UUID id) {
        CompanyResponseDTO response = companyService.getCompanyById(id);
        return ResponseEntity.ok(response);
    }

    // ✅ GET - Obtener empresas del usuario actual
    @GetMapping("/my-companies")                                     // @RequestHeader("X-User-Id") UUID userIdendpoint revisado en postman
    public ResponseEntity<List<CompanyResponseDTO>> getMyCompanies(
           ) {

        List<CompanyResponseDTO> responses = companyService.getCompaniesByUser(getCurrentUserId());
        return ResponseEntity.ok(responses);
    }

    // ✅ GET - Obtener todas las empresas (solo admin/operadores)
    @GetMapping                                                   //endpoint revisado en postman
    public ResponseEntity<List<CompanyResponseDTO>> getAllCompanies() {
        List<CompanyResponseDTO> responses = companyService.getAllCompanies();
        return ResponseEntity.ok(responses);
    }

    // ✅ PUT - Actualizar empresa
    @PutMapping("/{id}")                                    //endpoint revisado en postman
    public ResponseEntity<CompanyResponseDTO> updateCompany(
            @PathVariable UUID id,
            @Valid @RequestBody CompanyUpdateDTO updateDTO) {

        CompanyResponseDTO response = companyService.updateCompany(id, updateDTO, getCurrentUserId());
        return ResponseEntity.ok(response);
    }

    // ✅ DELETE - Eliminar empresa (CORREGIDO a UUID)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(
            @PathVariable UUID id
          ) {

        companyService.deleteCompany(id, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    // ✅ GET - Buscar empresas por sector
    @GetMapping("/search/sector")//futura implementacion para operadores para enconcontrar pymes por sector
    public ResponseEntity<List<CompanyResponseDTO>> getCompaniesBySector(
            @RequestParam String sector) {

        List<CompanyResponseDTO> responses = companyService.getCompaniesByBusinessSector(sector);
        return ResponseEntity.ok(responses);
    }

    // ✅ GET - Buscar empresas por rango de empleados
    @GetMapping("/search/employees")
    public ResponseEntity<List<CompanyResponseDTO>> getCompaniesByEmployeeRange(
            @RequestParam Integer minEmployees,
            @RequestParam Integer maxEmployees) {

        List<CompanyResponseDTO> responses = companyService.getCompaniesByEmployeeRange(minEmployees, maxEmployees);
        return ResponseEntity.ok(responses);
    }

    // ✅ GET - Obtener empresas rentables
    @GetMapping("/profitable")
    public ResponseEntity<List<CompanyResponseDTO>> getProfitableCompanies() {
        List<CompanyResponseDTO> responses = companyService.getProfitableCompanies();
        return ResponseEntity.ok(responses);
    }

    // ✅ GET - Buscar empresa por identificación tributaria
    @GetMapping("/search/tax/{taxIdentification}")
    public ResponseEntity<CompanyResponseDTO> getCompanyByTaxIdentification(
            @PathVariable String taxIdentification) {

        CompanyResponseDTO response = companyService.getCompanyByTaxIdentification(taxIdentification);
        return ResponseEntity.ok(response);
    }

    // ✅ GET - Verificar si usuario es propietario de la empresa (CORREGIDO a UUID)
    @GetMapping("/{id}/ownership")
    public ResponseEntity<Boolean> checkOwnership(
            @PathVariable UUID id
           ) {

        boolean ownsCompany = companyService.userOwnsCompany(getCurrentUserId(), id);
        return ResponseEntity.ok(ownsCompany);
    }

    // ✅ GET - Contar empresas del usuario (CORREGIDO a UUID)
    @GetMapping("/count/my-companies")
    public ResponseEntity<Long> countMyCompanies(@RequestHeader("X-User-Id") UUID userId) {
        Long count = companyService.countCompaniesByUser(getCurrentUserId());
        return ResponseEntity.ok(count);
    }
}