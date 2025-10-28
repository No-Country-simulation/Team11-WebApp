package com.nocountry.pyme_creditos.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.nocountry.pyme_creditos.enums.DocumentType;

import lombok.Data;

@Data
public class DocumentRequestDTO {
	private List<DocumentType> types;
	private String applicationId;
	private List<MultipartFile> files;
}
