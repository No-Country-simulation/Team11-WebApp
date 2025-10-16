package com.nocountry.pyme_creditos.repository;

import com.nocountry.pyme_creditos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    // Método para encontrar usuario por ID con UUID
    Optional<User> findById(UUID id);

    // Si necesitas buscar por un ID numérico (Long) también, puedes agregar:
    // Optional<User> findByUserId(Long userId);
}