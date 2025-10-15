package com.nocountry.pyme_creditos.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.nocountry.pyme_creditos.enums.TransferPurpose;
import com.nocountry.pyme_creditos.enums.TransferStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transfers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transfer {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name ="id_transfer", updatable = false, nullable = false)
	private UUID id;
	
	//Relacion con Company
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_id", nullable = false)
	private Company company;
	
	//Relacion con BankAccount
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bank_account_id", nullable = false)
	private BankAccount bankAccount;
	
	@Column(name = "transfer_amount", nullable = false, precision = 15, scale = 2)
	private BigDecimal transferAmount;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "purpose", nullable = false)
	private TransferPurpose purpose = TransferPurpose.OTHER;

	@Enumerated(EnumType.STRING)
	@Column(name = "transfer_status", nullable = false)
	private TransferStatus transferStatus = TransferStatus.PENDING;
	
	@Column(name = "transfer_receipt_url", nullable = false, length = 255)
	private String transferReceiptUrl;
	
	//Fechas
	@Column(name = "requested_at", nullable = false)
	private LocalDateTime requestedAt = LocalDateTime.now();

	@Column(name = "processed_at")
	private LocalDateTime processedAt;
	
	@Column(name = "authorization_code", nullable = false, length = 100)
	private String authorizationCode;
}
