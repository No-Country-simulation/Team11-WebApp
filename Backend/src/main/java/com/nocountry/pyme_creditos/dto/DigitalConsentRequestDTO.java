// dto/DigitalConsentRequest.java
package com.nocountry.pyme_creditos.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DigitalConsentRequestDTO {
    @NotNull
    private Boolean consent;          // debe venir true
    private String signatureDocument; //  (URL/base64 mock)
}
