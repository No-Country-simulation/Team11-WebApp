package com.nocountry.pyme_creditos.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class GlobalExceptionHandlerTest {
	
	private GlobalExceptionHandler handler;
	private HttpServletRequest request;
	
	@BeforeEach
	
	void setup() {
		handler = new GlobalExceptionHandler();
		request = mock(HttpServletRequest.class);
		when(request.getRequestURI()).thenReturn("/api/test");
	}
	
	//Bad REQUEST
	@Test
	void handleBadRequestException_Returns400() {
		BadRequestException ex = new BadRequestException("Parámetros inválidos");
		ResponseEntity<ErrorResponse> response =  handler.handleBadRequestException(ex, request);
		
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().getStatus());
        assertEquals("Bad Request", response.getBody().getError());
        assertEquals("Parámetros inválidos", response.getBody().getMessage());
        assertEquals("/api/test", response.getBody().getPath());		
	}
	
	// notFound
    @Test
    void handleNotFoundException_returns404() {
        NotFoundException ex = new NotFoundException("Recurso no encontrado");
        ResponseEntity<ErrorResponse> response = handler.handleNotFoundException(ex, request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(404, response.getBody().getStatus());
        assertEquals("Not Found", response.getBody().getError());
        assertEquals("Recurso no encontrado", response.getBody().getMessage());
        assertEquals("/api/test", response.getBody().getPath());
    }
    
    // CONFLICT
    @Test
    void handleConflictException_returns409() {
        ConflictException ex = new ConflictException("Ya existe un registro con ese ID");
        ResponseEntity<ErrorResponse> response = handler.handleConflictException(ex, request);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(409, response.getBody().getStatus());
        assertEquals("Conflict", response.getBody().getError());
        assertEquals("Ya existe un registro con ese ID", response.getBody().getMessage());
        assertEquals("/api/test", response.getBody().getPath());
    }
    
    
    // UNAUTHORIZED
    @Test
    void handleUnauthorizedException_returns401() {
        UnauthorizedException ex = new UnauthorizedException("Acceso denegado");
        ResponseEntity<ErrorResponse> response = handler.handleUnauthorizedException(ex, request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(401, response.getBody().getStatus());
        assertEquals("Unauthorized", response.getBody().getError());
        assertEquals("Acceso denegado", response.getBody().getMessage());
        assertEquals("/api/test", response.getBody().getPath());
    }
    
    // EXCEPCIÓN GENÉRICA
    @Test
    void handleGenericException_returns500() {
        Exception ex = new Exception("Error inesperado");
        ResponseEntity<ErrorResponse> response = handler.handleGenericException(ex, request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(500, response.getBody().getStatus());
        assertEquals("Internal Server Error", response.getBody().getError());
        assertEquals("Error inesperado", response.getBody().getMessage());
        assertEquals("/api/test", response.getBody().getPath());
    }
}
