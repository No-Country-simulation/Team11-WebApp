package com.nocountry.pyme_creditos.dto;

import org.springframework.web.multipart.MultipartFile;

import com.nocountry.pyme_creditos.enums.DocumentType;

import lombok.Data;

@Data
public class DocumentRequestDTO {
	private MultipartFile file;
	private DocumentType type;
}
