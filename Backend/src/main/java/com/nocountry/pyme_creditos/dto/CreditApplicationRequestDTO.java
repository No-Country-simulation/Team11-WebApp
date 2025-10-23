package com.nocountry.pyme_creditos.dto;

import com.nocountry.pyme_creditos.enums.CreditType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;


@Data
public class CreditApplicationRequestDTO {

    @NotNull(message = "Company ID es requerido")
    private UUID companyId;

    @NotNull(message = "Tipo de crédito es requerido")
    private CreditType creditType;

    @NotBlank(message = "Descripción es requerida")
    @Size(max = 500, message = "Descripción no puede exceder 500 caracteres")
    private String description;

    @NotNull(message = "Monto solicitado es requerido")
    @Positive(message = "Monto debe ser mayor a 0")
    private Double requestedAmount;

    @NotNull(message = "Plazo en meses es requerido")
    @Min(value = 1, message = "Plazo mínimo es 1 mes")
    @Max(value = 360, message = "Plazo máximo es 360 meses")
    private Integer termMonths;

    @NotNull(message = "Aceptación de términos es requerida")
    @AssertTrue(message = "Debe aceptar los términos y condiciones")
    private Boolean applicationCheckbox;
}