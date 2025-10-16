package com.nocountry.pyme_creditos.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.nocountry.pyme_creditos.enums.KYCProvider;
import com.nocountry.pyme_creditos.enums.KYCStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "kyc_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KycVerification {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id_kyc", updatable = false, nullable = false)
	private UUID id;
	
	//Relacion con User
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id",nullable = false)
	private User user;
	
	//Relacion con CreditApplication
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "application_id", nullable = false)
	private CreditApplication application;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "kyc_status", nullable = false)
	private KYCStatus kycStatus = KYCStatus.PENDING;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "provider", nullable = false)
	private KYCProvider provider;
	
	//Fechas
	@Column(name = "submitted_at", nullable = false)
	private LocalDateTime submittedAt = LocalDateTime.now();

	@Column(name = "verified_at")
	private LocalDateTime verifiedAt;

	@Column(name = "expires_at")
	private LocalDateTime expiresAt;
	
	@Column(name = "verification_data", columnDefinition = "TEXT")
	private String verificationData;
	
	//Risk
	@Column(name = "risk_score")
	private Integer riskScore;
}
