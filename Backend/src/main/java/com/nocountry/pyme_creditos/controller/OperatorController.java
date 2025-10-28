/*package com.nocountry.pyme_creditos.controller;

//controlador de prueba para el inicio de sesion, no se si nos vamos a manejar asi

import com.nocountry.pyme_creditos.dto.CompanyResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/operator")
class OperatorController {
    // ✅ GET - Obtener todas las empresas (solo admin/operadores)
    @GetMapping                                                   //endpoint revisado en postman
    public ResponseEntity<List<CompanyResponseDTO>> getAllCompanies() {
        List<CompanyResponseDTO> responses = companyService.getAllCompanies();
        return ResponseEntity.ok(responses);
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
}*/
