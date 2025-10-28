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
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "signature_id")
    private DigitalSignature signature;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(name = "credit_types", nullable = false)
    private CreditType creditType;

    @Column(name = "description")
    private String description;

    @Column(name = "requested_amount", nullable = false)
    private Double requestedAmount;

    @Column(name = "term_months", nullable = false)
    private Integer termMonths;

    @Column(name = "monthly_revenue", nullable = false)
    private Double monthlyRevenue;

    @Column(name = "monthly_expenses", nullable = false)
    private Double monthlyExpenses;

    @Column(name = "company_years", nullable = false)
    private Integer companyYears;

    @Column(name = "monthly_profit")
    private Double monthlyProfit;

    @Column(name = "is_profitable")
    private Boolean isProfitable;

    @Column(name = "company_size")
    private String companySize;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "credit_status", nullable = false)
    private CreditStatus creditStatus = CreditStatus.SAVE;

    @Column(name = "application_checkbox", nullable = false)
    private Boolean applicationCheckbox = false;

    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    // Constructor vacío para JPA
    public CreditApplication() {}

    public CreditApplication(Company company, CreditType creditType, String description,
                             Double requestedAmount, Integer termMonths, Boolean applicationCheckbox) {
        this.company = company;
        this.creditType = creditType;
        this.description = description;
        this.requestedAmount = requestedAmount;
        this.termMonths = termMonths;
        this.applicationCheckbox = applicationCheckbox;
    }

    // Métodos de negocio
    public Double calculateMonthlyProfit() {
        return this.monthlyRevenue - this.monthlyExpenses;
    }

    public boolean isProfitable() {
        return calculateMonthlyProfit() > 0;
    }

    // Calcular campos derivados y actualizar fechas automáticamente
    @PrePersist
    @PreUpdate
    public void updateDerivedFields() {
        // Calcular ganancia mensual
        if (monthlyRevenue != null && monthlyExpenses != null) {
            this.monthlyProfit = monthlyRevenue - monthlyExpenses;
            this.isProfitable = this.monthlyProfit > 0;
        }

        // Clasificar tamaño de empresa según cantidad de empleados
        if (employeeCount != null) {
            if (employeeCount < 10) this.companySize = "Microempresa";
            else if (employeeCount < 50) this.companySize = "Pequeña";
            else if (employeeCount < 250) this.companySize = "Mediana";
            else this.companySize = "Grande";
        }

        // Actualizar fecha de modificación
        this.updatedAt = LocalDateTime.now();

        // Crear fecha de creación si es null
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
