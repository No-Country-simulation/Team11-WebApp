package com.nocountry.pyme_creditos.dto;

import com.nocountry.pyme_creditos.enums.CreditType;
import lombok.Data;

@Data
public class CreditApplicationUpdateDTO {
    private CreditType creditType;
    private String description;
    private Double requestedAmount;
    private Integer termMonths;
    private Boolean applicationCheckbox;
    private Double monthlyRevenue;
    private Double monthlyExpenses;
    private Integer companyYears;
}
