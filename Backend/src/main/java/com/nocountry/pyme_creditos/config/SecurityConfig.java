package com.nocountry.pyme_creditos.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authorize) -> authorize
                        //  Aquí están las rutas públicas.

                        .requestMatchers( "/auth/register-client",
                                "/auth/register-operator").permitAll()

                        //  Todas las demás rutas requerirán autenticación (por ejemplo, /users, /creditos, etc.)
                        .anyRequest().authenticated()
                );

        //  Construye la configuración final de seguridad
        return http.build();
    }

    //  Maneja el proceso de autenticación (login)
    // Usa el servicio que busca usuarios (UserDetailsService) y el codificador de contraseñas (PasswordEncoder)
    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        //  Este proveedor verifica usuario + contraseña usando tu implementación de UserDetailsService
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        // 🔁 El ProviderManager coordina la autenticación con los proveedores configurados
        return new ProviderManager(authenticationProvider);
    }

    //para hacer login
    /* @Bean
    public UserDetailsService userDetailsService(UserService userService) {
        return userService; // Spring Security usará tu implementación real
    }*/

    // Define cómo se van a cifrar las contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Usa BCrypt por defecto, aunque soporta múltiples esquemas
        // Al registrar un usuario, se debe usar este mismo encoder para cifrar su contraseña
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

}
