package com.nocountry.pyme_creditos.repository;

import com.nocountry.pyme_creditos.model.ApplicationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationHistoryRepository extends JpaRepository<ApplicationHistory, UUID> {

    // ✅ Encontrar historial por aplicación, ordenado por fecha descendente
    @Query("SELECT h FROM ApplicationHistory h WHERE h.application.id = :applicationId ORDER BY h.historyChangedAt DESC")
    List<ApplicationHistory> findByApplicationIdOrderByHistoryChangedAtDesc(@Param("applicationId") UUID applicationId);

    // ✅ Encontrar historial por usuario
    @Query("SELECT h FROM ApplicationHistory h WHERE h.user.id = :userId ORDER BY h.historyChangedAt DESC")
    List<ApplicationHistory> findByUserIdOrderByHistoryChangedAtDesc(@Param("userId") UUID userId);

    // ✅ Encontrar historial por estado anterior
    List<ApplicationHistory> findByPreviousStatusOrderByHistoryChangedAtDesc(String previousStatus);

    // ✅ Encontrar historial por estado nuevo  
    List<ApplicationHistory> findByNewStatusOrderByHistoryChangedAtDesc(String newStatus);
}