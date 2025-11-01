package com.nocountry.pyme_creditos.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class DigitalSignatureRequestDTO {
    private UUID applicationId;
    private UUID userId; //firmante
}
