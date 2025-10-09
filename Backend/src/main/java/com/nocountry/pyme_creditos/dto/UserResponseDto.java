package com.nocountry.pyme_creditos.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class UserResponseDto {

    // getters y setters
    private Long id;
    private String name;
    private String lastName;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private String message;

}
