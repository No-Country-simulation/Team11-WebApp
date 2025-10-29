package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.dto.LoginRequestDto;
import com.nocountry.pyme_creditos.dto.LoginResponseDto;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.UserRepository;
import com.nocountry.pyme_creditos.security.JwtUtilRsa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserDetailsService userDetailsService;
    @Autowired private JwtUtilRsa jwtUtilRsa;
    @Autowired private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto req) {
        try {
            UsernamePasswordAuthenticationToken authReq =
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword());
            authenticationManager.authenticate(authReq);

            UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());

            // roles para claim "roles" (sin prefijo ROLE_)
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(a -> a.startsWith("ROLE_") ? a.substring(5) : a)
                    .collect(Collectors.toList());

            String token = jwtUtilRsa.generateToken(userDetails.getUsername(), Map.of("roles", roles));

            // Obtener el usuario de la base de datos para el id
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            return ResponseEntity.ok(new LoginResponseDto(
                    user.getId(),                  // UUID
                    token,                         // token JWT
                    userDetails.getUsername(),     // email
                    roles                          // roles
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error","credenciales_invalidas","message","Usuario o contraseña incorrectos."));
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error","usuario_deshabilitado","message","La cuenta está deshabilitada."));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error","autenticacion_fallida","message","No se pudo autenticar."));
        }
    }
}
