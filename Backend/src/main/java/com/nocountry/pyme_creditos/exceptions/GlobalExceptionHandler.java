package com.nocountry.pyme_creditos.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice //Le dice a Spring que esta clase maneja las excepciones globalmente
public class GlobalExceptionHandler {
	
	
	//Manejo de NotFoundException
	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex, HttpServletRequest request) {
		ErrorResponse errorResponse = new ErrorResponse(
				HttpStatus.INTERNAL_SERVER_ERROR.value(), 
				HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(), 
				ex.getMessage(), 
				request.getRequestURI()
		);
		return new ResponseEntity<>(errorResponse,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	//Manejo de BadRequestException
	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex, HttpServletRequest request) {
		ErrorResponse errorResponse = new ErrorResponse(
				HttpStatus.BAD_REQUEST.value(), 
				HttpStatus.BAD_REQUEST.getReasonPhrase(), 
				ex.getMessage(), 
				request.getRequestURI()
		);
		return new ResponseEntity<>(errorResponse,HttpStatus.BAD_REQUEST);		
	}
	
	//Manejo genérico para cualquier excepción no controladaa
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
		ErrorResponse errorResponse = new ErrorResponse(
				HttpStatus.INTERNAL_SERVER_ERROR.value(), 
				HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(), 
				ex.getMessage(), 
				request.getRequestURI()
		);
		return new ResponseEntity<>(errorResponse,HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
