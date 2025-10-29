package com.nocountry.pyme_creditos.repository;

import com.nocountry.pyme_creditos.enums.CreditStatus;

import com.nocountry.pyme_creditos.enums.TaskStatus;
import com.nocountry.pyme_creditos.model.OperatorTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OperatorTaskRepository extends JpaRepository <OperatorTask, UUID>{

    // Trae todas las tareas cuyo crédito asociado tenga un estado específico
    List<OperatorTask> findByCreditApplication_CreditStatus(CreditStatus creditStatus);

    // Trae todas las tareas de un crédito y estado de tarea específico
    List<OperatorTask> findByCreditApplication_CreditStatusAndTaskStatus(CreditStatus creditStatus, TaskStatus taskStatus);


}
