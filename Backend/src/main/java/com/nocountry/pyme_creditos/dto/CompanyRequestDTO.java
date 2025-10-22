package com.nocountry.pyme_creditos.dto;

import jakarta.validation.constraints.*;
import lombok.Data;



@Data
public class CompanyRequestDTO {

    @NotBlank(message = "Nombre legal es requerido")
    @Size(max = 255, message = "Nombre legal no puede exceder 255 caracteres")
    private String legalName;

    @NotBlank(message = "Identificación tributaria es requerida")
    @Size(max = 50, message = "Identificación tributaria no puede exceder 50 caracteres")
    private String taxIdentification;

    @NotBlank(message = "Dirección es requerida")
    @Size(max = 500, message = "Dirección no puede exceder 500 caracteres")
    private String address;

    @NotBlank(message = "Email corporativo es requerido")
    @Email(message = "Email corporativo debe ser válido")
    private String companyEmail;

    @NotBlank(message = "Sector de negocio es requerido")
    @Size(max = 100, message = "Sector de negocio no puede exceder 100 caracteres")
    private String businessSector;

    @NotNull(message = "Número de empleados es requerido")
    @Min(value = 1, message = "Debe tener al menos 1 empleado")
    @Max(value = 10000, message = "Número de empleados no puede exceder 10000")
    private Integer employeeCount;

    @NotNull(message = "Ingresos mensuales son requeridos")
    @PositiveOrZero(message = "Ingresos mensuales deben ser mayor o igual a 0")
    private Double monthlyRevenue;

    @NotNull(message = "Gastos mensuales son requeridos")
    @PositiveOrZero(message = "Gastos mensuales deben ser mayor o igual a 0")
    private Double monthlyExpenses;

    @NotNull(message = "Años de operación son requeridos")
    @Min(value = 0, message = "Años de operación debe ser mayor o igual a 0")
    @Max(value = 200, message = "Años de operación no puede exceder 200")
    private Integer companyYears;
}