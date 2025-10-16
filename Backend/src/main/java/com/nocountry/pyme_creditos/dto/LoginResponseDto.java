package com.nocountry.pyme_creditos.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoginResponseDto {
    private String token;
    private String email;
    private List<String> roles;

    public LoginResponseDto() {}

    public LoginResponseDto (String token, String email, List<String> roles) {
        this.token = token;
        this.email = email;
        this.roles = roles;
    }
}
