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
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
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
                   Integer employeeCount) {
        this.user = user;
        this.legalName = legalName;
        this.taxIdentification = taxIdentification;
        this.address = address;
        this.companyEmail = companyEmail;
        this.businessSector = businessSector;
        this.employeeCount = employeeCount;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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