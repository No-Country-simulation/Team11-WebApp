package com.nocountry.pyme_creditos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "digital_signatures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DigitalSignature {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    @Column(name = "id_signature", updatable = false, nullable = false)
    private UUID id;

    // Relación UNO-a-UNO con User (cada usuario tiene UNA firma)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", unique = true, nullable = false)
    private Company company;



    // Documento de firma (podría ser PDF, imagen, etc.)
    @Column(name = "signature_document", nullable = false, columnDefinition = "TEXT")
    private String signatureDocument; // Puede ser Base64, URL, o path al archivo

    // Fecha de creación
    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructor para fácil creación
    public DigitalSignature(Company company, String signatureDocument) {
        this.company = company;
        this.signatureDocument = signatureDocument;
        this.createdAt = LocalDateTime.now();
    }

    // Metodo para actualizar timestamp si es necesario
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}