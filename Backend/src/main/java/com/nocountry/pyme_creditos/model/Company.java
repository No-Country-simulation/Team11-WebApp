package com.nocountry.pyme_creditos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "company")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_company", updatable = false, nullable = false)
    private UUID id; // ✅ UUID con nueva sintaxis

    // Relación con User (propietario)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Información legal
    @Column(name = "legal_name", nullable = false)
    private String legalName;

    @Column(name = "tax_Company", nullable = false, unique = true)
    private String taxIdentification;

    // Dirección
    @Column(name = "adress", nullable = false)
    private String address;

    @Column(name = "company_Email", nullable = false)
    private String companyEmail;

    // Información del negocio
    @Column(name = "business_sector", nullable = false)
    private String businessSector;

    @Column(name = "employee_count", nullable = false)
    private Integer employeeCount;

    // Información financiera
    @Column(name = "monthly_revenue", nullable = false)
    private Double monthlyRevenue;

    @Column(name = "monthly_expenses", nullable = false)
    private Double monthlyExpenses;

    @Column(name = "company_years", nullable = false)
    private Integer companyYears;

    @OneToMany(mappedBy = "company",  cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private Set<CreditApplication> creditApplications;

    // Auditoría
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Métodos de ciclo de vida
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructor para fácil creación
    public Company(User user, String legalName, String taxIdentification,
                   String address, String companyEmail, String businessSector,
                   Integer employeeCount, Double monthlyRevenue, Double monthlyExpenses,
                   Integer companyYears) {
        this.user = user;
        this.legalName = legalName;
        this.taxIdentification = taxIdentification;
        this.address = address;
        this.companyEmail = companyEmail;
        this.businessSector = businessSector;
        this.employeeCount = employeeCount;
        this.monthlyRevenue = monthlyRevenue;
        this.monthlyExpenses = monthlyExpenses;
        this.companyYears = companyYears;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Métodos de negocio
    public Double calculateMonthlyProfit() {
        return this.monthlyRevenue - this.monthlyExpenses;
    }

    public boolean isProfitable() {
        return calculateMonthlyProfit() > 0;
    }

    public String getCompanySize() {
        if (employeeCount <= 10) {
            return "PEQUEÑA";
        } else if (employeeCount <= 50) {
            return "MEDIANA";
        } else if (employeeCount <= 250) {
            return "GRANDE";
        } else {
            return "MUY GRANDE";
        }
    }
}