package com.nocountry.pyme_creditos.model;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bank_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id_bank_account", updatable = false, nullable = false)
	private UUID id;
	
	//Relacion con Company
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_id", nullable = false)
	private Company company;
	
	//Datos bancarios
	@Column(name = "cbu_cvu", nullable = false, length = 22, unique = true)
	private String cbuCvu;
	
	@Column(name = "account_number", nullable = false, length = 30)
	private String accountNumber;
	
	@Column(name = "bank_name", nullable = false, length = 50)
	private String bankName;

}
