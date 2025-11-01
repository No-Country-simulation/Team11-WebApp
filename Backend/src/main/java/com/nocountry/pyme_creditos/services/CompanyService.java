package com.nocountry.pyme_creditos.services;

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


    // Validar si el usuario ya tiene empresa
    public boolean userHasCompany(UUID userId) {
        return companyRepository.existsByUserId(userId);
    }

    // Crear empresa solo si no tiene
    public CompanyResponseDTO createCompany(CompanyRequestDTO requestDTO, UUID userId) {
        if (userHasCompany(userId)) {
            throw new RuntimeException("Usuario ya tiene una empresa");
        }


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Company company = new Company(
                user,
                requestDTO.getLegalName(),
                requestDTO.getTaxIdentification(),
                requestDTO.getAddress(),
                requestDTO.getCompanyEmail(),
                requestDTO.getBusinessSector(),
                requestDTO.getEmployeeCount()

        );

        return new CompanyResponseDTO(companyRepository.save(company));
    }

    // Obtener la empresa del usuario (DTO)
    @Transactional(readOnly = true)
    public CompanyResponseDTO getMyCompany(UUID userId) {
        Company company = companyRepository.findByUserId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuario no tiene empresa"));
        return new CompanyResponseDTO(company);
    }

    // Obtener la empresa del usuario como entidad (para relaciones)
    @Transactional(readOnly = true)
    public Company getMyCompanyEntity(UUID userId) {
        return companyRepository.findByUserId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuario no tiene empresa"));
    }


    // Actualizar empresa del usuario
    public CompanyResponseDTO updateCompanyByUser(CompanyUpdateDTO updateDTO, UUID userId) {
        Company company = companyRepository.findByUserId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuario no tiene empresa"));

        company.setLegalName(updateDTO.getLegalName());
        company.setAddress(updateDTO.getAddress());
        company.setCompanyEmail(updateDTO.getCompanyEmail());
        company.setBusinessSector(updateDTO.getBusinessSector());
        company.setEmployeeCount(updateDTO.getEmployeeCount());


        return new CompanyResponseDTO(companyRepository.save(company));
    }

    // Eliminar empresa del usuario
    public void deleteCompanyByUser(UUID userId) {
        Company company = companyRepository.findByUserId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuario no tiene empresa"));
        companyRepository.delete(company);
    }
}
