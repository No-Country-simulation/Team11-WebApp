package com.nocountry.pyme_creditos.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nocountry.pyme_creditos.dto.DocumentRequestDTO;
import com.nocountry.pyme_creditos.dto.DocumentResponseDTO;
import com.nocountry.pyme_creditos.enums.DocumentType;
import com.nocountry.pyme_creditos.exceptions.BadRequestException;
import com.nocountry.pyme_creditos.exceptions.NotFoundException;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.UserRepository;
import com.nocountry.pyme_creditos.services.DocumentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/documents")
@RequiredArgsConstructor
public class DocumentController {
	
	private final DocumentService documentService;
	private final UserRepository userRepository;
	
	//Subir un documento para una solicitud de credito
	@PostMapping(value = "/application/{applicationId}/upload", consumes = "multipart/form-data")	
	public ResponseEntity <List<DocumentResponseDTO>> uploadDocument(
			@PathVariable UUID applicationId,
			@ModelAttribute DocumentRequestDTO request,
			Authentication authentication){
				
		if(authentication == null || authentication.getName() == null) {
			throw new BadRequestException("Usuario no autenticado o token inválido.");
		}
		
		String email = authentication.getName();
		
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new NotFoundException("Usuario no encontrado para email: " + email));
		
		List<MultipartFile> files = request.getFiles();
		List<DocumentType> types = request.getTypes();
		
		if(files == null || types.isEmpty()) {
			throw new BadRequestException("Debe subir, al menos, un archivo.");
		}
		
		if(files.size() != types.size()) {
			throw new BadRequestException("Debe haber la misma cantidad de tipos que de archivos.");
		}
		
		List<DocumentResponseDTO> response = documentService.uploadMultiple(applicationId, files, types, user);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	
	
	// Obtener documento por Id
	@GetMapping("/{documentId}")
	public ResponseEntity<DocumentResponseDTO> getDocumentById(@PathVariable UUID documentId){
		DocumentResponseDTO dto = documentService.getDocumentById(documentId);
		return ResponseEntity.ok(dto);
	}
	
	// Listar todos los documentos de una solicitud
	@GetMapping("/application/{applicationId}")
	public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByApplication(@PathVariable UUID applicationId){
		List<DocumentResponseDTO> docs = documentService.getDocumentsByApplication(applicationId);
		return ResponseEntity.ok(docs);
	}
	
	// Eliminar documento por Id
	@DeleteMapping("/{documentId}")
	public ResponseEntity<Void> deleteDocument(@PathVariable UUID documentId) {
	    documentService.deleteDocument(documentId);
	    return ResponseEntity.noContent().build();
	}
}
