package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.*;

import com.nocountry.pyme_creditos.model.CreditApplication;
import com.nocountry.pyme_creditos.model.Company;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.repository.CreditApplicationRepository;
import com.nocountry.pyme_creditos.repository.DigitalSignatureRepository;
import com.nocountry.pyme_creditos.security.SecurityUtils;
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
    // En CreditApplicationService
    public DigitalSignatureResponseDTO attachSignature(UUID applicationId, UUID currentUserId, DigitalConsentRequestDTO req) {
        log.info("Adjuntando firma a aplicación {} por el usuario {}", applicationId, currentUserId);

        // 1) Buscar aplicación
        CreditApplication app = creditApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada con ID: " + applicationId));

        // 2) Validar ownership
        UUID ownerId = app.getCompany().getUser().getId();
        if (!ownerId.equals(currentUserId)) {
            throw new SecurityException("No autorizado: la aplicación no pertenece al usuario actual");
        }

        // 3) Validar estado: solo en SAVE
        if (app.getCreditStatus() != CreditStatus.SAVE) {
            throw new IllegalStateException("La firma solo puede adjuntarse antes del envío (estado SAVE)");
        }

        // 4) Validar consentimiento
        if (req.getConsent() == null || !req.getConsent()) {
            throw new IllegalArgumentException("Debe aceptar el consentimiento (checkbox)");
        }

        // 5) Crear sesión de firma (MOCK) y registro DigitalSignature
        return signatureService.createSignatureMock(app.getId(), currentUserId);
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

        // Antes de cambiar a PENDING
        var signature = application.getSignature();
        if (signature == null) {
            throw new IllegalStateException("La aplicación no puede enviarse sin que el representante firme previamente");
        }
        if (!"completed".equals(signature.getStatus())) {
            throw new IllegalStateException("La firma de la aplicación debe estar completada antes de enviar");
        }



        // Cambiar estado a PENDING (al hacer submit, se cambia a pending)
        application.setCreditStatus(CreditStatus.PENDING);

        // Registrar en historial (si tienes este servicio)
         historyService.recordStatusChange(application, CreditStatus.SAVE, CreditStatus.PENDING, "Aplicación enviada");

        CreditApplication updatedApplication = creditApplicationRepository.save(application);
        log.info("Aplicación {} enviada exitosamente", applicationId);

        return new CreditApplicationResponseDTO(updatedApplication);
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


        CreditApplication updatedApplication = creditApplicationRepository.save(application);
        log.info("Estado de aplicación {} actualizado exitosamente", applicationId);

        return new CreditApplicationResponseDTO(updatedApplication);
    }


    // ✅ UPDATE PARCIAL - Actualizar solo los campos que se envían (solo SAVE)
    public CreditApplicationResponseDTO updateApplicationPartial(UUID applicationId, CreditApplicationUpdateDTO dto) {
        log.info("Actualizando parcialmente aplicación con ID: {}", applicationId);

        CreditApplication application = creditApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Aplicación no encontrada con ID: " + applicationId));

        // Solo permitir actualización si está en estado SAVE
        if (application.getCreditStatus() != CreditStatus.SAVE) {
            throw new IllegalStateException("Solo se pueden modificar aplicaciones en estado SAVE (borrador)");
        }

        // Aplicar solo campos que no sean null
        if(dto.getCreditType() != null) application.setCreditType(dto.getCreditType());
        if(dto.getDescription() != null) application.setDescription(dto.getDescription());
        if(dto.getRequestedAmount() != null) application.setRequestedAmount(dto.getRequestedAmount());
        if(dto.getTermMonths() != null) application.setTermMonths(dto.getTermMonths());
        if(dto.getApplicationCheckbox() != null) application.setApplicationCheckbox(dto.getApplicationCheckbox());
        if(dto.getMonthlyRevenue() != null) application.setMonthlyRevenue(dto.getMonthlyRevenue());
        if(dto.getMonthlyExpenses() != null) application.setMonthlyExpenses(dto.getMonthlyExpenses());
        if(dto.getCompanyYears() != null) application.setCompanyYears(dto.getCompanyYears());

        CreditApplication updatedApplication = creditApplicationRepository.save(application);
        log.info("Aplicación {} actualizada parcialmente exitosamente", applicationId);

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
            case PENDING -> to == CreditStatus.APPROVED || to == CreditStatus.REJECTED || to == CreditStatus.CANCELLED;
            case APPROVED, REJECTED, CANCELLED -> false; // Estados finales
        };
    }
}