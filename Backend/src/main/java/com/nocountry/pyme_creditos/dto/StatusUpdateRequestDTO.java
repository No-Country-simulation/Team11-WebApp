package com.nocountry.pyme_creditos.dto;

import com.nocountry.pyme_creditos.enums.CreditStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;



@Data
public class StatusUpdateRequestDTO {

    @NotNull(message = "Nuevo estado es requerido")
    private CreditStatus newStatus;

    private String comments;
}