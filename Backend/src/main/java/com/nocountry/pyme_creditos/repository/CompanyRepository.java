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
public interface CompanyRepository extends JpaRepository<Company, UUID> {

    List<Company> findByUserId(UUID userId);

    Optional<Company> findByTaxIdentification(String taxIdentification);

    boolean existsByTaxIdentification(String taxIdentification);

    List<Company> findByBusinessSector(String businessSector);

    Optional<Company> findByCompanyEmail(String companyEmail);

    Long countByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}
