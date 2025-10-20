package com.nocountry.pyme_creditos.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.nocountry.pyme_creditos.enums.DocumentType;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id_document", updatable = false, nullable = false)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User uploadedBy;
	
	//Relacion con CreditApplication
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "application_id", nullable = false)
	private CreditApplication application;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "document_type", nullable = false)
	private DocumentType documentType;
	
	@Column(name = "file_url", nullable = false, length = 255)
	private String fileUrl;
	
	@Column(name = "document_uploaded_at", nullable = false)
	private LocalDateTime documentUploadeddAt = LocalDateTime.now();
	
	@Column(name = "is_valid", nullable = false)
	private boolean isValid = false;
	
	@Column(name = "document_signed_at")
	private LocalDateTime documentSignedAt;
	
	@Column(name = "is_signed", nullable = false)
	private boolean isSigned = false;
}
