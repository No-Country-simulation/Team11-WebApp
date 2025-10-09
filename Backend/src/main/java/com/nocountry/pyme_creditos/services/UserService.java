package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.UserRequestDto;
import com.nocountry.pyme_creditos.enums.Roles;
import com.nocountry.pyme_creditos.exceptions.UserAlreadyExistException;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.password.PasswordEncoder;

public class UserService  {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerClient(UserRequestDto dto) throws UserAlreadyExistException {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new UserAlreadyExistException("Correo ya registrado");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setLastName(dto.getLastName());
        user.setDni(dto.getDni());
        user.setEmail(dto.getEmail());
        user.setPassword_hash(passwordEncoder.encode(dto.getPassword()));

        // Asignamos rol CLIENT por defecto
        user.setRoles(Roles.CLIENT);

        return userRepository.save(user);
    }

    public User registerOperator(UserRequestDto dto) throws UserAlreadyExistException {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new UserAlreadyExistException("Correo ya registrado");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setLastName(dto.getLastName());
        user.setDni(dto.getDni());
        user.setEmail(dto.getEmail());
        user.setPassword_hash(passwordEncoder.encode(dto.getPassword()));

        // Asignamos rol OPERATOR
        user.setRoles(Roles.OPERATOR);

        return userRepository.save(user);
    }

}
