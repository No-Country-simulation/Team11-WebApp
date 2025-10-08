package com.nocountry.pyme_creditos.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "companies")
@Data
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "legal_name", nullable = false, length = 255)
    private String legalName;

    @Column(name = "tax_id", unique = true, nullable = false, length = 50)
    private String taxId;

    @Column(length = 500)
    private String address;

    @Column(name = "company_email", nullable = false, length = 255)
    private String companyEmail;

    @Column(name = "business_sector", length = 100)
    private String businessSector;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "monthly_revenue")
    private Double monthlyRevenue;

    @Column(name = "monthly_expenses")
    private Double monthlyExpenses;

    @Column(name = "company_years")
    private Integer companyYears;

    // Relación con User (propietario de la empresa)
   /* @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;*/
}
