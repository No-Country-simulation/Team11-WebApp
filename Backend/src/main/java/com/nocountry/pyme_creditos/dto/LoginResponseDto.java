package com.nocountry.pyme_creditos.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class LoginResponseDto {

    private UUID id;
    private String token;
    private String email;
    private List<String> roles;

    public LoginResponseDto() {}

    public LoginResponseDto (UUID id,String token, String email, List<String> roles) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.roles = roles;
    }
}
