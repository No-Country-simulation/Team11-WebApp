package com.nocountry.pyme_creditos.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nocountry.pyme_creditos.dto.DocumentResponseDTO;
import com.nocountry.pyme_creditos.enums.DocumentType;
import com.nocountry.pyme_creditos.exceptions.BadRequestException;
import com.nocountry.pyme_creditos.exceptions.NotFoundException;
import com.nocountry.pyme_creditos.model.CreditApplication;
import com.nocountry.pyme_creditos.model.Document;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.CreditApplicationRepository;
import com.nocountry.pyme_creditos.repository.DocumentRepository;
import com.nocountry.pyme_creditos.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
	
	private final DocumentRepository documentRepository;
	private final CreditApplicationRepository applicationRepository;
	private final UserRepository userRepository;
	
	
	@Value("${file.upload-dir:uploads}")
	private String uploadDir;
	
	private static final long MAX_SIZE = 5 * 1024 * 1024; //5MB
	
	public DocumentResponseDTO uploadDocument(UUID applicationId, DocumentType type, MultipartFile file, User user) {
		
		//Verifica si existe la solicitud de crédito
		CreditApplication app = applicationRepository.findById(applicationId)
								.orElseThrow(() -> new NotFoundException("La solicitud de crédito con id " + applicationId + " no existe"));
		
		//Valida que el archivo no este vacio
		if (file.isEmpty()) {
			throw new BadRequestException("El archivo no puede estar vacio.");
		}
		
		if(!isValidFileType(file)) {
			throw new BadRequestException("Tipo de archivo no permitido. Solo se permite: PDF, JPG, PNG");
		}
		
		//Valida el tamaño (máximo 5MB)
		if(file.getSize() > MAX_SIZE) {
			throw new BadRequestException("El tamaño del archivo es muy grande (mayor a 5MG");
		}		
		
		Path rootPath = Paths.get(uploadDir);
		
		//Crea la carpeta si no existe
			try {
				if(!Files.exists(rootPath)) {
				Files.createDirectories(rootPath);
				}
			} catch (IOException e) {
				throw new BadRequestException("Error al crear el directorio de uploads: " + e.getMessage());
			}

		//Genera nombre único
		String uniqueName = UUID.randomUUID() + "_" + file.getOriginalFilename();
		Path filePath = rootPath.resolve(uniqueName);
		
		//Lo guarda
		try {
			Files.copy(file.getInputStream(),filePath, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new BadRequestException("Error al guardar el archivo: " + e.getMessage());
		}
		
		//Crea entidad Document
		Document document = new Document();
		document.setApplication(app);
		document.setDocumentType(type);
		document.setFileUrl(filePath.toString());
		document.setDocumentUploadedAt(LocalDateTime.now());
		
		documentRepository.save(document);
		
		return mapToDTO(document);
		
	}
	
	private DocumentResponseDTO mapToDTO(Document document) {
		DocumentResponseDTO dto = new DocumentResponseDTO();
		dto.setId(document.getId());
		dto.setApplicationId(document.getApplication().getId());
		dto.setDocumentType(document.getDocumentType());
		dto.setFileUrl(document.getFileUrl());
		dto.setDocumentUploadedAt(document.getDocumentUploadedAt());
		dto.setValid(document.isValid());
		dto.setSigned(document.isSigned());
		dto.setDocumentSignedAt(document.getDocumentSignedAt());

		return dto;
	}
	
	private boolean isValidFileType(MultipartFile file) {
		String contentType = file.getContentType();
		return contentType !=null && (
			contentType.equals("application/pdf") ||
			contentType.equals("image/jpeg") ||
			contentType.equals("image/jpg") ||
			contentType.equals("image/png")
		);
	}
}
