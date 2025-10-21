package com.nocountry.pyme_creditos.repository;

import com.nocountry.pyme_creditos.model.ApplicationHistory;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationHistoryRepository extends JpaRepository<ApplicationHistory, UUID> {

    /**
     * Encuentra el historial de una aplicación ordenado por fecha descendente
     */
    List<ApplicationHistory> findByApplicationIdOrderByHistoryChangedAtDesc(UUID applicationId);

    /**
     * Encuentra el último cambio de estado de una aplicación
     */
    Optional<ApplicationHistory> findTopByApplicationIdOrderByHistoryChangedAtDesc(UUID applicationId);

    /**
     * Encuentra el historial de cambios por usuario
     */
    List<ApplicationHistory> findByUserIdOrderByHistoryChangedAtDesc(UUID userId);

    /**
     * Verifica si una aplicación ha tenido un estado específico
     */
    boolean existsByApplicationIdAndNewStatus(UUID applicationId, CreditStatus status);

    /**
     * Encuentra cambios de estado entre fechas
     */
    List<ApplicationHistory> findByApplicationIdAndHistoryChangedAtBetweenOrderByHistoryChangedAtDesc(
            UUID applicationId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Encuentra todas las aplicaciones que han pasado por un estado específico
     */
    @Query("SELECT DISTINCT ah.application.id FROM ApplicationHistory ah WHERE ah.newStatus = :status")
    List<UUID> findApplicationIdsByStatus(@Param("status") CreditStatus status);

    /**
     * Cuenta los cambios de estado por tipo de estado
     */
    @Query("SELECT COUNT(ah) FROM ApplicationHistory ah WHERE ah.newStatus = :status")
    long countByNewStatus(@Param("status") CreditStatus status);
}