package com.nocountry.pyme_creditos.repository;

import com.nocountry.pyme_creditos.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> { // ✅ UUID

    // ✅ Buscar empresas por usuario propietario (UUID)
    List<Company> findByUserId(UUID userId);

    // ✅ Buscar empresa por identificación tributaria
    Optional<Company> findByTaxIdentification(String taxIdentification);

    // ✅ Verificar si existe empresa con identificación tributaria
    boolean existsByTaxIdentification(String taxIdentification);

    // ✅ Buscar empresas por sector de negocio
    List<Company> findByBusinessSector(String businessSector);

    // ✅ Buscar empresas por rango de empleados
    @Query("SELECT c FROM Company c WHERE c.employeeCount BETWEEN :min AND :max")
    List<Company> findByEmployeeCountRange(@Param("min") Integer min, @Param("max") Integer max);

    // ✅ Buscar empresas con rentabilidad positiva
    @Query("SELECT c FROM Company c WHERE (c.monthlyRevenue - c.monthlyExpenses) > 0")
    List<Company> findProfitableCompanies();

    // ✅ Buscar empresa por email corporativo
    Optional<Company> findByCompanyEmail(String companyEmail);

    // ✅ Contar empresas por usuario (UUID)
    Long countByUserId(UUID userId);
}