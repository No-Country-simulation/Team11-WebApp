package com.nocountry.pyme_creditos.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class DigitalSignatureResponseDTO {
    private UUID signatureId;
    private String provider;
    private String envelopeId;
    private String signingUrl;
    private String status;
}
