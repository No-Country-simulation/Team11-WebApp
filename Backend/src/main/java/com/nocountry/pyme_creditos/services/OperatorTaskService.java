package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.OperatorTaskDTO;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.enums.TaskStatus;
import com.nocountry.pyme_creditos.model.OperatorTask;
import com.nocountry.pyme_creditos.model.CreditApplication;
import com.nocountry.pyme_creditos.repository.OperatorTaskRepository;
import com.nocountry.pyme_creditos.repository.CreditApplicationRepository;
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
public class OperatorTaskService {

    private final OperatorTaskRepository operatorTaskRepository;
    private final CreditApplicationRepository creditApplicationRepository;

    // ✅ Obtener tareas filtradas (por estado de crédito o tarea)
    @Transactional(readOnly = true)
    public List<OperatorTaskDTO> getTasks(CreditStatus creditStatus, TaskStatus taskStatus) {
        log.info("Buscando tareas: creditStatus={}, taskStatus={}", creditStatus, taskStatus);

        List<OperatorTask> tasks;

        if (creditStatus != null && taskStatus != null) {
            tasks = operatorTaskRepository.findByCreditApplication_CreditStatusAndTaskStatus(creditStatus, taskStatus);
        } else if (creditStatus != null) {
            tasks = operatorTaskRepository.findByCreditApplication_CreditStatus(creditStatus);
        } else {
            tasks = operatorTaskRepository.findAll();
        }

        return tasks.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ Obtener una tarea específica
    @Transactional(readOnly = true)
    public OperatorTaskDTO getTaskById(UUID taskId) {
        OperatorTask task = operatorTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + taskId));

        return toDTO(task);
    }

    // ✅ Aprobar un crédito (tarea en progreso → completada, crédito → aprobado)
    public OperatorTaskDTO approveCredit(UUID taskId) {
        log.info("Aprobando crédito para tarea {}", taskId);

        OperatorTask task = operatorTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + taskId));

        CreditApplication creditApp = task.getCreditApplication();

        // Validar estados
        if (creditApp.getCreditStatus() != CreditStatus.PENDING ||
                task.getTaskStatus() != TaskStatus.IN_PROGRESS) {
            throw new IllegalStateException("Solo se pueden aprobar créditos en revisión con tareas en progreso");
        }

        // Actualizar estados
        creditApp.setCreditStatus(CreditStatus.APPROVED);
        task.setTaskStatus(TaskStatus.COMPLETED);
        task.setTaskResolvedAt(java.time.LocalDateTime.now());

        creditApplicationRepository.save(creditApp);
        operatorTaskRepository.save(task);

        return toDTO(task);
    }

    // ✅ Rechazar un crédito (tarea en progreso → rechazada, crédito → rechazado)
    public OperatorTaskDTO rejectCredit(UUID taskId) {
        log.info("Rechazando crédito para tarea {}", taskId);

        OperatorTask task = operatorTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + taskId));

        CreditApplication creditApp = task.getCreditApplication();

        // Validar estados
        if (creditApp.getCreditStatus() != CreditStatus.PENDING ||
                task.getTaskStatus() != TaskStatus.IN_PROGRESS) {
            throw new IllegalStateException("Solo se pueden rechazar créditos en revisión con tareas en progreso");
        }

        // Actualizar estados
        creditApp.setCreditStatus(CreditStatus.REJECTED);
        task.setTaskStatus(TaskStatus.REJECTED);
        task.setTaskResolvedAt(java.time.LocalDateTime.now());

        creditApplicationRepository.save(creditApp);
        operatorTaskRepository.save(task);

        return toDTO(task);
    }

    // ✅ Conversión a DTO
    private OperatorTaskDTO toDTO(OperatorTask task) {
        return new OperatorTaskDTO(
                task.getId(),
                task.getCreditApplication().getId(),
                task.getCreditApplication().getCreditStatus(),
                task.getTaskType(),
                task.getTaskStatus(),
                task.getTaskAssignedAt(),
                task.getTaskResolvedAt()
        );
    }
}
