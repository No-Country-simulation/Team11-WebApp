package com.nocountry.pyme_creditos.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.nocountry.pyme_creditos.enums.CreditStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "application_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationHistory {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "application_history",updatable = false, nullable = false)
	private UUID id;
	
	//Relacion con CreditApplication
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "application_id", nullable = false)
	private CreditApplication application;
	
	//Relacion con User
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id",nullable = false)
	private User user;
	
	//Estados de la aplicacion
	@Enumerated(EnumType.STRING)
	@Column(name = "previous_status", nullable = false)
	private CreditStatus previousStatus;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "new_status", nullable = false)
	private CreditStatus newStatus;
	
	//Fechas
	@Column(name = "history_changed_at")
	private LocalDateTime historyChangedAt = LocalDateTime.now();
	
	//Comentarios
	@Column(name = "comments", columnDefinition = "TEXT")
	private String comments;

}
