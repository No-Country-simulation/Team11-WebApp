package com.nocountry.pyme_creditos.controller;

//controlador de prueba para el inicio de sesion, no se si nos vamos a manejar asi

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/client")
class ClientController {
    @GetMapping("/ping") public Map<String,String> ping() {
        return Map.of("ok","client");
    }
}