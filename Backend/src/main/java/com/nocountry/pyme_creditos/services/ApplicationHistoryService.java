package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.model.ApplicationHistory;
import com.nocountry.pyme_creditos.model.CreditApplication;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.repository.ApplicationHistoryRepository;
import com.nocountry.pyme_creditos.repository.UserRepository;
import com.nocountry.pyme_creditos.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationHistoryService {

    private final ApplicationHistoryRepository applicationHistoryRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    // ✅ Registrar cambio de estado
    public void recordStatusChange(CreditApplication application, CreditStatus previousStatus,
                                   CreditStatus newStatus, String comments) {
        log.info("Registrando cambio de estado para aplicación {}: {} -> {}",
                application.getId(), previousStatus, newStatus);

        // Obtener usuario actual desde Spring Security
        User currentUser = getCurrentUser();

        ApplicationHistory history = new ApplicationHistory();
        history.setApplication(application);
        history.setUser(currentUser);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setComments(comments);

        applicationHistoryRepository.save(history);
        log.info("Historial registrado exitosamente para aplicación {}", application.getId());
    }

    // ✅ Obtener historial de una aplicación
    @Transactional(readOnly = true)
    public List<ApplicationHistory> getApplicationHistory(UUID applicationId) {
        log.info("Obteniendo historial para aplicación: {}", applicationId);
        return applicationHistoryRepository.findByApplicationIdOrderByHistoryChangedAtDesc(applicationId);
    }

    // ✅ Obtener usuario actual desde Spring Security


    private User getCurrentUser() {
        UUID userId = securityUtils.getCurrentUserId(); // obtener ID real de tu usuario
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

}