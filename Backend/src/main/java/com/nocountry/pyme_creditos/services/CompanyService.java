package com.nocountry.pyme_creditos.service;

import com.nocountry.pyme_creditos.dto.CompanyRequestDTO;
import com.nocountry.pyme_creditos.dto.CompanyResponseDTO;
import com.nocountry.pyme_creditos.dto.CompanyUpdateDTO;
import com.nocountry.pyme_creditos.model.Company;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.CompanyRepository;
import com.nocountry.pyme_creditos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    // ✅ CREATE - Crear nueva empresa (CORREGIDO: UUID)
    public CompanyResponseDTO createCompany(CompanyRequestDTO requestDTO, UUID userId) {
        log.info("Creando nueva empresa para usuario: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        // Validar que la identificación tributaria sea única
        if (companyRepository.existsByTaxIdentification(requestDTO.getTaxIdentification())) {
            throw new RuntimeException("Ya existe una empresa con la identificación tributaria: " + requestDTO.getTaxIdentification());
        }

        // Validar que el email corporativo sea único
        if (companyRepository.findByCompanyEmail(requestDTO.getCompanyEmail()).isPresent()) {
            throw new RuntimeException("Ya existe una empresa con el email corporativo: " + requestDTO.getCompanyEmail());
        }

        // Crear la empresa
        Company company = new Company(
                user,
                requestDTO.getLegalName(),
                requestDTO.getTaxIdentification(),
                requestDTO.getAddress(),
                requestDTO.getCompanyEmail(),
                requestDTO.getBusinessSector(),
                requestDTO.getEmployeeCount(),
                requestDTO.getMonthlyRevenue(),
                requestDTO.getMonthlyExpenses(),
                requestDTO.getCompanyYears()
        );

        Company savedCompany = companyRepository.save(company);
        log.info("Empresa creada exitosamente con ID: {}", savedCompany.getId());

        return new CompanyResponseDTO(savedCompany);
    }

    // ✅ READ - Obtener empresa por ID (CORREGIDO: UUID)
    @Transactional(readOnly = true)
    public CompanyResponseDTO getCompanyById(UUID id) {
        log.info("Buscando empresa con ID: {}", id);

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));

        return new CompanyResponseDTO(company);
    }

    // ✅ READ - Obtener empresas por usuario (CORREGIDO: UUID)
    @Transactional(readOnly = true)
    public List<CompanyResponseDTO> getCompaniesByUser(UUID userId) {
        log.info("Buscando empresas del usuario: {}", userId);

        return companyRepository.findByUserId(userId)
                .stream()
                .map(CompanyResponseDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ READ - Obtener todas las empresas
    @Transactional(readOnly = true)
    public List<CompanyResponseDTO> getAllCompanies() {
        log.info("Buscando todas las empresas");

        return companyRepository.findAll()
                .stream()
                .map(CompanyResponseDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ UPDATE - Actualizar empresa (CORREGIDO: UUID)
    public CompanyResponseDTO updateCompany(UUID companyId, CompanyUpdateDTO updateDTO, UUID userId) {
        log.info("Actualizando empresa con ID: {}", companyId);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + companyId));

        // Validar que el usuario sea el propietario
        if (!company.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tiene permisos para actualizar esta empresa");
        }

        // Validar email corporativo único (si cambió)
        if (!company.getCompanyEmail().equals(updateDTO.getCompanyEmail())) {
            if (companyRepository.findByCompanyEmail(updateDTO.getCompanyEmail()).isPresent()) {
                throw new RuntimeException("Ya existe una empresa con el email corporativo: " + updateDTO.getCompanyEmail());
            }
        }

        // Actualizar campos
        company.setLegalName(updateDTO.getLegalName());
        company.setAddress(updateDTO.getAddress());
        company.setCompanyEmail(updateDTO.getCompanyEmail());
        company.setBusinessSector(updateDTO.getBusinessSector());
        company.setEmployeeCount(updateDTO.getEmployeeCount());
        company.setMonthlyRevenue(updateDTO.getMonthlyRevenue());
        company.setMonthlyExpenses(updateDTO.getMonthlyExpenses());
        company.setCompanyYears(updateDTO.getCompanyYears());

        Company updatedCompany = companyRepository.save(company);
        log.info("Empresa {} actualizada exitosamente", companyId);

        return new CompanyResponseDTO(updatedCompany);
    }

    /*/ ✅ DELETE - Eliminar empresa (CORREGIDO: UUID)
    public void deleteCompany(UUID companyId, UUID userId) {
        log.info("Eliminando empresa con ID: {}", companyId);

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + companyId));

        // Validar que el usuario sea el propietario
        if (!company.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tiene permisos para eliminar esta empresa");
        }

        // Validar que no tenga solicitudes de crédito activas
        if (company.getCreditApplications() != null && !company.getCreditApplications().isEmpty()) {
            throw new RuntimeException("No se puede eliminar la empresa porque tiene solicitudes de crédito asociadas");
        }

        companyRepository.delete(company);
        log.info("Empresa {} eliminada exitosamente", companyId);
    }*/

    // ✅ Métodos de búsqueda
    @Transactional(readOnly = true)
    public List<CompanyResponseDTO> getCompaniesByBusinessSector(String sector) {
        return companyRepository.findByBusinessSector(sector)
                .stream()
                .map(CompanyResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CompanyResponseDTO> getCompaniesByEmployeeRange(Integer min, Integer max) {
        return companyRepository.findByEmployeeCountRange(min, max)
                .stream()
                .map(CompanyResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CompanyResponseDTO> getProfitableCompanies() {
        return companyRepository.findProfitableCompanies()
                .stream()
                .map(CompanyResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompanyResponseDTO getCompanyByTaxIdentification(String taxIdentification) {
        Company company = companyRepository.findByTaxIdentification(taxIdentification)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con identificación: " + taxIdentification));
        return new CompanyResponseDTO(company);
    }

    // ✅ Métodos de validación (CORREGIDO: UUID)
    @Transactional(readOnly = true)
    public boolean userOwnsCompany(UUID userId, UUID companyId) {
        return companyRepository.findById(companyId)
                .map(company -> company.getUser().getId().equals(userId))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public Long countCompaniesByUser(UUID userId) {
        return companyRepository.countByUserId(userId);
    }
}