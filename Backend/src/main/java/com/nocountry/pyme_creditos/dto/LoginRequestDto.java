package com.nocountry.pyme_creditos.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequestDto {
    private String email;
    private String password;

    public LoginRequestDto(String email, String password){
        this.email = email;
        this.password = password;
    }
}
