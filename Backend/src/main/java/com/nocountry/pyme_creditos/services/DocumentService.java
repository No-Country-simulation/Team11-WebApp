package com.nocountry.pyme_creditos.services;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.nocountry.pyme_creditos.enums.DocumentType;
import com.nocountry.pyme_creditos.exceptions.BadRequestException;
import com.nocountry.pyme_creditos.exceptions.NotFoundException;
import com.nocountry.pyme_creditos.model.CreditApplication;
import com.nocountry.pyme_creditos.model.Document;
import com.nocountry.pyme_creditos.repository.CreditApplicationRepository;
import com.nocountry.pyme_creditos.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
	
	private final DocumentRepository documentRepository;
	private final CreditApplicationRepository applicationRepository;

	private final Path rootPath = Paths.get("uploads"); //carpeta para almacenar documentos
	
	public Document uploadDocument(UUID applicationId, DocumentType type, MultipartFile file) throws IOException {
		
		//Verifica si existe la solicitud de crédito
		CreditApplication app = applicationRepository.findById(applicationId)
								.orElseThrow(() -> new NotFoundException("La solicitud de crédito con id " + applicationId + " no existe"));
		
		//Crea la carpeta si no existe
		if(!Files.exists(rootPath)) {
			Files.createDirectories(rootPath);
		}
		
		//Valida el tamaño (máximo 5MB)
		if(file.getSize() > 5 * 1024 * 1024) {
			throw new BadRequestException("El tamaño del archivo es muy grande (mayor a 5MG");
		}
		
		//Genera nombre único
		String uniqueName = UUID.randomUUID() + "_" + file.getOriginalFilename();
		
		//Guarda el archivo
		Path filePath = rootPath.resolve(uniqueName);
		Files.copy(file.getInputStream(),filePath, StandardCopyOption.REPLACE_EXISTING);
		
		//Crea entidad Document
		Document document = new Document();
		document.setApplication(app);
		document.setDocumentType(type);
		document.setFileUrl(filePath.toString());
		document.setDocumentUploadeddAt(LocalDateTime.now());
		
		return documentRepository.save(document);
		
	}
}
