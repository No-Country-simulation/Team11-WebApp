package com.nocountry.pyme_creditos.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.nocountry.pyme_creditos.enums.DocumentType;

import lombok.Data;

@Data
public class DocumentResponseDTO {
	private UUID id;
	private UUID applicationId;
	private DocumentType documentType;
	private String fileUrl;
	private LocalDateTime documentUploadedAt;
	private boolean isValid;
	private boolean isSigned;
	private LocalDateTime documentSignedAt;
}
