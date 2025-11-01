package com.nocountry.pyme_creditos.dto;

import com.nocountry.pyme_creditos.model.Company;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CompanyResponseDTO {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userEmail;
    private String legalName;
    private String taxIdentification;
    private String address;
    private String companyEmail;
    private String businessSector;
    private Integer employeeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor desde la entidad
    public CompanyResponseDTO(Company company) {
        this.id = company.getId();
        this.userId = company.getUser().getId();
        this.userName = company.getUser().getName() + " " + company.getUser().getLastName();
        this.userEmail = company.getUser().getEmail();
        this.legalName = company.getLegalName();
        this.taxIdentification = company.getTaxIdentification();
        this.address = company.getAddress();
        this.companyEmail = company.getCompanyEmail();
        this.businessSector = company.getBusinessSector();
        this.employeeCount= company.getEmployeeCount();
        this.createdAt = company.getCreatedAt();
        this.updatedAt = company.getUpdatedAt();
    }
}