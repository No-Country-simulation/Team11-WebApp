package com.nocountry.pyme_creditos.config;


import com.nocountry.pyme_creditos.security.JwtAuthenticationEntryPoint;
import com.nocountry.pyme_creditos.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Autowired
    private JwtRequestFilter jwtRequestFilter; // @Component

    @Autowired
    private JwtAuthenticationEntryPoint entryPoint; // @Component

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // API stateless (sin cookies csrf)
                .csrf(csrf -> csrf.disable())

                // Respuestas 401 en JSON desde nuestro entry point
                .exceptionHandling(e -> e.authenticationEntryPoint(entryPoint))

                // Sin sesiones en servidor
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Autorización por rutas
                .authorizeHttpRequests(auth -> auth
                        // públicas
                        .requestMatchers(
                                "/auth/login",
                                "/auth/register",
                                "/auth/operator/register",
                                "/auth/.well-known/jwks.json"
                        ).permitAll()

                        // ej. por rol (opcional, si es que lo vamos a usar)
                        .requestMatchers("/operator/**").hasRole("OPERATOR")
                        .requestMatchers("/client/**").hasRole("CLIENT")

                        // el resto, autenticado
                        .anyRequest().authenticated()
                );

        // Inyectar el filtro JWT antes del filtro de username/password
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


    // Define cómo se van a cifrar las contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Usa BCrypt por defecto, aunque soporta múltiples esquemas
        // Al registrar un usuario, se debe usar este mismo encoder para cifrar su contraseña
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

}
