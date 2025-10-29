package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.CreditApplicationResponseDTO;
import com.nocountry.pyme_creditos.dto.OperatorTaskDTO;
import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.enums.TaskStatus;
import com.nocountry.pyme_creditos.model.OperatorTask;
import com.nocountry.pyme_creditos.repository.CreditApplicationRepository;
import com.nocountry.pyme_creditos.repository.OperatorTaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OperatorTaskService {

    private final OperatorTaskRepository operatorTaskRepository;

    // ✅ Obtener tareas por estado de crédito y estado de tarea (opcional)
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
                .map(task -> new OperatorTaskDTO(
                        task.getId(),
                        task.getCreditApplication().getId(),
                        task.getCreditApplication().getCreditStatus(),
                        task.getTaskType(),
                        task.getTaskStatus(),
                        task.getTaskAssignedAt(),
                        task.getTaskResolvedAt()
                ))
                .collect(Collectors.toList());
    }

    // ✅ Obtener tarea por ID
    @Transactional(readOnly = true)
    public OperatorTaskDTO getTaskById(UUID taskId) {
        OperatorTask task = operatorTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + taskId));

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
