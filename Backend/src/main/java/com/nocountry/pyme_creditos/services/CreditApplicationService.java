package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.CreditApplicationRequestDTO;
import com.nocountry.pyme_creditos.dto.CreditApplicationResponseDTO;
import com.nocountry.pyme_creditos.dto.DigitalConsentRequestDTO;
import com.nocountry.pyme_creditos.dto.StatusUpdateRequestDTO;
import com.nocountry.pyme_creditos.model.CreditApplication;
import com.nocountry.pyme_creditos.model.Company;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.enums.CreditType;
import com.nocountry.pyme_creditos.repository.CreditApplicationRepository;
import com.nocountry.pyme_creditos.repository.CompanyRepository;
import com.nocountry.pyme_creditos.repository.DigitalSignatureRepository;
import com.nocountry.pyme_creditos.security.SecurityUtils;
import com.nocountry.pyme_creditos.services.ApplicationHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CreditApplicationService {

    private final CreditApplicationRepository creditApplicationRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationHistoryService historyService; // Para auditoría
    private final SecurityUtils securityUtils;
    private final CompanyService companyService;
    private final DigitalSignatureRepository signatureRepo;
    private final DigitalSignatureService signatureService;


    // ✅ CREATE - Crear nueva aplicación (estado SAVE)
    public CreditApplicationResponseDTO createApplication(CreditApplicationRequestDTO requestDTO) {
        // Obtener usuario logueado
        UUID userId = securityUtils.getCurrentUserId();

        // Obtener la compañía asociada al usuario
        Company company = companyService.getMyCompanyEntity(userId);


        // Validar que no tenga aplicaciones pendientes del mismo tipo
        if (creditApplicationRepository.existsPendingApplicationOfType(company.getId(), requestDTO.getCreditType())) {
            throw new IllegalStateException("Ya existe una aplicación pendiente del mismo tipo para esta compañía");
        }

        // Crear la aplicación
        CreditApplication application = new CreditApplication();
        application.setCompany(company); // <-- asignar compañía aquí
        application.setCreditType(requestDTO.getCreditType());
        application.setDescription(requestDTO.getDescription());
        application.setRequestedAmount(requestDTO.getRequestedAmount());
        application.setTermMonths(requestDTO.getTermMonths());
        application.setMonthlyRevenue(requestDTO.getMonthlyRevenue());
        application.setMonthlyExpenses(requestDTO.getMonthlyExpenses());
        application.setCompanyYears(requestDTO.getCompanyYears());
        application.setApplicationCheckbox(requestDTO.getApplicationCheckbox());
        application.setCreditStatus(CreditStatus.SAVE); // Estado inicial como borrador

        CreditApplication savedApplication = creditApplicationRepository.save(application);
        log.info("Aplicación creada exitosamente con ID: {}", savedApplication.getId());

        return new CreditApplicationResponseDTO(savedApplication);
    }

    // ✅ Adjuntar firma y consentimiento ANTES de /submit
    public CreditApplicationResponseDTO attachSignature(UUID applicationId, UUID currentUserId, DigitalConsentRequestDTO req) {
        log.info("Adjuntando firma a aplicación {} por el usuario {}", applicationId, currentUserId);

        // 1) Buscar aplicación
        CreditApplication app = creditApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada con ID: " + applicationId));

        // 2) Validar ownership: el dueño de la company debe ser el usuario actual
        UUID ownerId = app.getCompany().getUser().getId();
        if (!ownerId.equals(currentUserId)) {
            throw new SecurityException("No autorizado: la aplicación no pertenece al usuario actual");
        }

        // 3) Validar estado: solo en SAVE
        if (app.getCreditStatus() != CreditStatus.SAVE) {
            throw new IllegalStateException("La firma sólo puede adjuntarse antes del envío (estado SAVE)");
        }

        // 4) Validar consentimiento
        if (req.getConsent() == null || !req.getConsent()) {
            throw new IllegalArgumentException("Debe aceptar el consentimiento (checkbox)");
        }

        // 5) Crear sesión de firma (MOCK) y registro DigitalSignature (status=sent)
        var session = signatureService.createSignatureMock(app.getId(), currentUserId);

        // 6) Recuperar la firma recién creada y completar datos opcionales
        var signature = signatureRepo.findById(session.getSignatureId())
                .orElseThrow(() -> new IllegalStateException("Inconsistencia: firma recién creada no encontrada"));

        if (req.getSignatureDocument() != null && !req.getSignatureDocument().isBlank()) {
            // Si tu mock ya produce un “documento” preliminar
            signature.setSignatureDocument(req.getSignatureDocument());
            signatureRepo.save(signature);
        }

        // 7) Linkear en la aplicación y marcar checkbox
        app.setSignature(signature);
        app.setApplicationCheckbox(true);
        CreditApplication updated = creditApplicationRepository.save(app);

        log.info("Firma adjuntada a la aplicación {}. signatureId={}, status={}",
                applicationId, signature.getId(), signature.getStatus());

        // 8) Devolver respuesta usando tu DTO(entity)
        return new CreditApplicationResponseDTO(updated);
    }

    // ✅ SUBMIT - Enviar aplicación (cambia de SAVE a PENDING)
    public CreditApplicationResponseDTO submitApplication(UUID applicationId) {
        log.info("Enviando aplicación con ID: {}", applicationId);

        CreditApplication application = creditApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada con ID: " + applicationId));

        if (application.getCreditStatus() != CreditStatus.SAVE) {
            throw new IllegalStateException("Solo las aplicaciones en estado SAVE pueden ser enviadas");
        }

        if (!application.getApplicationCheckbox()) {
            throw new IllegalStateException("Debe aceptar los términos y condiciones para enviar la aplicación");
        }

        // Cambiar estado a PENDING
        application.setCreditStatus(CreditStatus.PENDING);


        historyService.recordStatusChange(application, CreditStatus.SAVE, CreditStatus.PENDING, "Aplicación enviada");



        // Registrar en historial (si tienes este servicio)
         historyService.recordStatusChange(application, CreditStatus.SAVE, CreditStatus.PENDING, "Aplicación enviada");

        CreditApplication updatedApplication = creditApplicationRepository.save(application);
        log.info("Aplicación {} enviada exitosamente", applicationId);

        return new CreditApplicationResponseDTO(updatedApplication);
    }

    // ✅ READ - Obtener aplicación por ID
    @Transactional(readOnly = true)
    public CreditApplicationResponseDTO getApplicationById(UUID id) {
        log.info("Buscando aplicación con ID: {}", id);

        CreditApplication application = creditApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada con ID: " + id));

        return new CreditApplicationResponseDTO(application);
    }

    // ✅ READ - Obtener todas las aplicaciones de una compañía
    @Transactional(readOnly = true)
    public List<CreditApplicationResponseDTO> getApplicationsByCompany(UUID companyId) {
        log.info("Buscando aplicaciones para compañía: {}", companyId);

        return creditApplicationRepository.findByCompanyId(companyId)
                .stream()
                .map(CreditApplicationResponseDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ READ - Obtener aplicaciones por estado (para operadores)
    @Transactional(readOnly = true)
    public List<CreditApplicationResponseDTO> getApplicationsByStatus(CreditStatus status) {
        log.info("Buscando aplicaciones con estado: {}", status);

        return creditApplicationRepository.findByCreditStatus(status)
                .stream()
                .map(CreditApplicationResponseDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ UPDATE - Actualizar estado (para operadores)
    public CreditApplicationResponseDTO updateApplicationStatus(UUID applicationId, StatusUpdateRequestDTO requestDTO) {
        log.info("Actualizando estado de aplicación {} a {}", applicationId, requestDTO.getNewStatus());

        CreditApplication application = creditApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada con ID: " + applicationId));

        CreditStatus previousStatus = application.getCreditStatus();
        CreditStatus newStatus = requestDTO.getNewStatus();

        // Validar transición de estado
        if (!isValidStatusTransition(previousStatus, newStatus)) {
            throw new IllegalStateException(
                    String.format("Transición de estado no válida: de %s a %s", previousStatus, newStatus)
            );
        }

        application.setCreditStatus(newStatus);

        // Registrar en historial
        historyService.recordStatusChange(application, previousStatus, newStatus, requestDTO.getComments());
        // historyService.recordStatusChange(application, previousStatus, newStatus, requestDTO.getComments());

        CreditApplication updatedApplication = creditApplicationRepository.save(application);
        log.info("Estado de aplicación {} actualizado exitosamente", applicationId);

        return new CreditApplicationResponseDTO(updatedApplication);
    }

    // ✅ UPDATE - Actualizar aplicación (solo en estado SAVE)
    public CreditApplicationResponseDTO updateApplication(UUID applicationId, CreditApplicationRequestDTO requestDTO) {
        log.info("Actualizando aplicación con ID: {}", applicationId);

        CreditApplication application = creditApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada con ID: " + applicationId));

        // Solo permitir actualización si está en estado SAVE
        if (application.getCreditStatus() != CreditStatus.SAVE) {
            throw new IllegalStateException("Solo se pueden modificar aplicaciones en estado SAVE (borrador)");
        }

        // Actualizar campos
        application.setCreditType(requestDTO.getCreditType());
        application.setDescription(requestDTO.getDescription());
        application.setRequestedAmount(requestDTO.getRequestedAmount());
        application.setTermMonths(requestDTO.getTermMonths());
        application.setApplicationCheckbox(requestDTO.getApplicationCheckbox());

        CreditApplication updatedApplication = creditApplicationRepository.save(application);
        log.info("Aplicación {} actualizada exitosamente", applicationId);

        return new CreditApplicationResponseDTO(updatedApplication);
    }

    // ✅ DELETE - Eliminar aplicación (solo en estado SAVE)
    public void deleteApplication(UUID applicationId) {
        log.info("Eliminando aplicación con ID: {}", applicationId);

        CreditApplication application = creditApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada con ID: " + applicationId));

        // Solo permitir eliminación si está en estado SAVE
        if (application.getCreditStatus() != CreditStatus.SAVE) {
            throw new IllegalStateException("Solo se pueden eliminar aplicaciones en estado SAVE (borrador)");
        }

        creditApplicationRepository.delete(application);
        log.info("Aplicación {} eliminada exitosamente", applicationId);
    }

    // ✅ Métodos auxiliares
    @Transactional(readOnly = true)
    public List<CreditApplicationResponseDTO> getApplicationsForReview() {
        return creditApplicationRepository.findApplicationsForReview()
                .stream()
                .map(CreditApplicationResponseDTO::new)
                .collect(Collectors.toList());
    }

    // Validar transiciones de estado
    private boolean isValidStatusTransition(CreditStatus from, CreditStatus to) {
        return switch (from) {
            case SAVE -> to == CreditStatus.PENDING;
            case PENDING -> to == CreditStatus.UNDER_REVIEW || to == CreditStatus.CANCELLED;
            case UNDER_REVIEW -> to == CreditStatus.APPROVED || to == CreditStatus.REJECTED;
            case APPROVED, REJECTED, CANCELLED -> false; // Estados finales
        };
    }
}