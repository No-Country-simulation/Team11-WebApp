package com.nocountry.pyme_creditos.repository;

import com.nocountry.pyme_creditos.model.CreditApplication;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.enums.CreditType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CreditApplicationRepository extends JpaRepository<CreditApplication, UUID> {

    // ✅ CORREGIDO: Cambiar Long por UUID
    List<CreditApplication> findByCompanyId(UUID companyId);

    List<CreditApplication> findByCreditStatus(CreditStatus status);

    List<CreditApplication> findByCreditType(CreditType creditType);

    @Query("SELECT ca FROM CreditApplication ca WHERE ca.company.id = :companyId AND ca.creditStatus = 'PENDING'")
    List<CreditApplication> findPendingApplicationsByCompany(@Param("companyId") UUID companyId);

    @Query("SELECT ca FROM CreditApplication ca WHERE ca.creditStatus IN ('PENDING', 'UNDER_REVIEW') ORDER BY ca.createdAt DESC")
    List<CreditApplication> findApplicationsForReview();

    @Query("SELECT COUNT(ca) > 0 FROM CreditApplication ca WHERE ca.company.id = :companyId AND ca.creditType = :creditType AND ca.creditStatus IN ('PENDING', 'UNDER_REVIEW')")
    boolean existsPendingApplicationOfType(@Param("companyId") UUID companyId,
                                           @Param("creditType") CreditType creditType);

    Long countByCreditStatus(CreditStatus status);
}