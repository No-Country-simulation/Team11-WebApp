package com.nocountry.pyme_creditos.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
import com.nocountry.pyme_creditos.model.Document;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.UserRepository;
import com.nocountry.pyme_creditos.services.DocumentService;

import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/documents")	
@RequiredArgsConstructor
public class DocumentController {
	
	private final DocumentService documentService;
	private final UserRepository userRepository;
	
	//@PostMapping(value="/application/{applicationId}", consumes="multipart/from-data")
	//Subir un documento para una solicitud de credito
	@PostMapping("/upload")	
	public ResponseEntity<DocumentResponseDTO> uploadDocument(
			@RequestParam("applicationId") UUID applicationId,
			@RequestParam("documentType") DocumentType documentType,
			@RequestParam("file") MultipartFile file,
			Authentication authentication){
				
		if(authentication == null || authentication.getName() == null) {
			throw new BadRequestException("Usuario no autenticado o token inválido.");
		}
		
		String email = authentication.getName();
		
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new NotFoundException("Usuario no encontrado para email: " + email));
		
		DocumentResponseDTO response = documentService.uploadDocument(applicationId, documentType, file, user);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
