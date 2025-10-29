package com.nocountry.pyme_creditos.dto;

import com.nocountry.pyme_creditos.enums.CreditStatus;
import com.nocountry.pyme_creditos.enums.TaskStatus;
import com.nocountry.pyme_creditos.enums.TaskType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class OperatorTaskDTO {
    private UUID taskId;
    private UUID applicationId;
    private CreditStatus creditStatus;
    private TaskType taskType;
    private TaskStatus taskStatus;
    private LocalDateTime taskAssignedAt;
    private LocalDateTime taskResolvedAt;
}
