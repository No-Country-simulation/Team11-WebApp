package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.UserRequestDto;
import com.nocountry.pyme_creditos.dto.UserResponseDto;
import com.nocountry.pyme_creditos.enums.Roles;
import com.nocountry.pyme_creditos.exceptions.UserAlreadyExistException;
import com.nocountry.pyme_creditos.model.User;
import com.nocountry.pyme_creditos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService  {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto registerNewUser(UserRequestDto dto) throws UserAlreadyExistException {
        return createUser(dto, Roles.CLIENT);
    }

    @Override
    public UserResponseDto registerOperator(UserRequestDto dto) throws UserAlreadyExistException {
        return createUser(dto, Roles.OPERATOR);
    }

    private UserResponseDto createUser(UserRequestDto dto, Roles roles) throws UserAlreadyExistException {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new UserAlreadyExistException("Correo ya registrado");
        }

        User user= new User();
        user.setName(dto.getName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword_hash(passwordEncoder.encode(dto.getPassword()));
        user.setDni(dto.getDni());
        user.setRoles(roles);

        userRepository.save(user);

        // Mapear entidad → Response DTO
        UserResponseDto response = new UserResponseDto();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRoles(user.getRoles());
        response.setCreatedAt(user.getCreatedAt());
        response.setMessage("Usuario registrado correctamente");

        return response;


    }
}
