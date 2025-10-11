package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.UserRequestDto;
import com.nocountry.pyme_creditos.dto.UserResponseDto;
import com.nocountry.pyme_creditos.exceptions.UserAlreadyExistException;
import com.nocountry.pyme_creditos.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private IUserService userService;

    // Endpoint para registrar clientes
    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody UserRequestDto dto) {
        try {
            UserResponseDto response = userService.registerNewUser(dto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (UserAlreadyExistException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Endpoint para registrar operadores
    @PostMapping("/operator/register")
    public ResponseEntity<?> registerOperator(@RequestBody UserRequestDto dto) {
        try {
            UserResponseDto response = userService.registerOperator(dto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (UserAlreadyExistException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
