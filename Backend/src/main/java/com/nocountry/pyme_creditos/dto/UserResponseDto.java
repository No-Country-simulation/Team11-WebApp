package com.nocountry.pyme_creditos.dto;

import com.nocountry.pyme_creditos.enums.Roles;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
public class UserResponseDto {



    private UUID id;
    private String name;
    private String lastName;
    private String email;
    private Roles roles;
    private LocalDateTime createdAt;
    private String message;


}
