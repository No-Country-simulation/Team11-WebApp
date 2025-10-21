package com.nocountry.pyme_creditos.model;

import com.nocountry.pyme_creditos.enums.CreditType;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "credit_applications")
@Data
@AllArgsConstructor
public class CreditApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_application", updatable = false, nullable = false)
    private UUID id; // ✅ CAMBIADO A UUID

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "signature_id")
    private DigitalSignature signature;

    // Relación con Company (PYME solicitante)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    // Tipo de crédito - ENUM exacto
    @Enumerated(EnumType.STRING)
    @Column(name = "credit_types", nullable = false)
    private CreditType creditType;

    // Descripción del crédito
    @Column(name = "description")
    private String description;

    // Monto solicitado
    @Column(name = "requested_amount", nullable = false)
    private Double requestedAmount;

    // Plazo en meses
    @Column(name = "term_months", nullable = false)
    private Integer termMonths;

    // Estado del crédito - ENUM exacto
    @Enumerated(EnumType.STRING)
    @Column(name = "credit_status", nullable = false)
    private CreditStatus creditStatus = CreditStatus.SAVE;

    // Checkbox de términos y condiciones
    @Column(name = "application_checkbox", nullable = false)
    private Boolean applicationCheckbox = false;

    // Fechas de auditoría
    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Metodo para actualizar fecha de modificación automáticamente
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructor para fácil creación
    public CreditApplication() {}

    public CreditApplication(Company company, CreditType creditType, String description,
                             Double requestedAmount, Integer termMonths, Boolean applicationCheckbox) {
        this.company = company;
        this.creditType = creditType;
        this.description = description;
        this.requestedAmount = requestedAmount;
        this.termMonths = termMonths;
        this.applicationCheckbox = applicationCheckbox;
        this.creditStatus = CreditStatus.SAVE;
    }
}