package com.nocountry.pyme_creditos.services;

import com.nocountry.pyme_creditos.dto.UserRequestDto;
import com.nocountry.pyme_creditos.dto.UserResponseDto;
import com.nocountry.pyme_creditos.exceptions.UserAlreadyExistException;

public interface IUserService {
    UserResponseDto registerNewUser(UserRequestDto dto) throws UserAlreadyExistException;
    UserResponseDto registerOperator(UserRequestDto dto) throws UserAlreadyExistException;
}