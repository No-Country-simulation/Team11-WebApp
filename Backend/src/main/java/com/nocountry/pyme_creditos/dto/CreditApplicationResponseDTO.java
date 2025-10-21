package com.nocountry.pyme_creditos.dto;

import com.nocountry.pyme_creditos.enums.CreditType;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.model.CreditApplication;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CreditApplicationResponseDTO {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private CreditType creditType;
    private String description;
    private Double requestedAmount;
    private Integer termMonths;
    private CreditStatus creditStatus;
    private Boolean applicationCheckbox;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor desde la entidad
    public CreditApplicationResponseDTO(CreditApplication application) {
        this.id = application.getId();
        this.companyId = application.getCompany().getId();
        this.companyName = application.getCompany().getLegalName();
        this.creditType = application.getCreditType();
        this.description = application.getDescription();
        this.requestedAmount = application.getRequestedAmount();
        this.termMonths = application.getTermMonths();
        this.creditStatus = application.getCreditStatus();
        this.applicationCheckbox = application.getApplicationCheckbox();
        this.createdAt = application.getCreatedAt();
        this.updatedAt = application.getUpdatedAt();
    }
}