package com.nocountry.pyme_creditos.exceptions;

public class BadRequestException extends RuntimeException{
	
	public BadRequestException(String message){
		super(message);
	}
}
