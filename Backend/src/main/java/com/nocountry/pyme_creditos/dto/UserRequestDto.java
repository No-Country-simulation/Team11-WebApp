package com.nocountry.pyme_creditos.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class UserRequestDto {

    // getters y setters
    @NotNull
    @NotEmpty
    private String name;

    @NotNull @NotEmpty
    private String lastName;

    @NotNull @NotEmpty
    private String dni;

    @NotNull @NotEmpty
    private String email;

    @NotNull @NotEmpty
    private String password;

}
