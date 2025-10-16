package com.nocountry.pyme_creditos.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.nocountry.pyme_creditos.enums.TaskStatus;
import com.nocountry.pyme_creditos.enums.TaskType;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "operator_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperatorTask {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id_task", updatable = false, nullable = false)
	private UUID id;
	
	//Relacion con User
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id",nullable = false)
	private User user;
	
	//Relacion con CreditApplication
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "application_id",nullable = false)
	private CreditApplication creditApplication;
	
	//Tipo de tarea (enum)
	@Enumerated(EnumType.STRING)
	@Column(name = "task_type", nullable = false)
	private TaskType taskType = TaskType.DOCUMENT_VALIDATION; 
	
	//Status de la tarea (enum)
	@Enumerated(EnumType.STRING)
	@Column(name = "task_status", nullable = false)
	private TaskStatus taskStatus = TaskStatus.PENDING;
	
	//Fechas
	@Column(name = "task_assigned_at", nullable = false)
	private LocalDateTime taskAssignedAt = LocalDateTime.now();

	@Column(name = "task_resolved_at")
	private LocalDateTime taskResolvedAt;

}
