package com.nocountry.pyme_creditos;

import com.nocountry.pyme_creditos.model.*;
import com.nocountry.pyme_creditos.enums.*;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class EntitiesUnitTest {

    @Test
    void testOperatorTaskEntity() {
        User user = new User();
        CreditApplication app = new CreditApplication();

        OperatorTask task = new OperatorTask();
        task.setUser(user);
        task.setCreditApplication(app);
        task.setTaskType(TaskType.DOCUMENT_VALIDATION);
        task.setTaskStatus(TaskStatus.PENDING);
        task.setTaskAssignedAt(LocalDateTime.now());

        assertThat(task.getUser()).isEqualTo(user);
        assertThat(task.getCreditApplication()).isEqualTo(app);
    }

    @Test
    void testBankAccountEntity() {
        Company company = new Company();
        BankAccount account = new BankAccount();
        account.setCompany(company);
        account.setAccountNumber("12345");
        account.setCbuCvu(new String("1234567890123456789012"));
        account.setBankName("Banco Test");

        assertThat(account.getBankName()).isEqualTo("Banco Test");
        assertThat(account.getCbuCvu()).isEqualTo(new String("1234567890123456789012"));
    }

    @Test
    void testDocumentEntity() {
        CreditApplication app = new CreditApplication();
        Document doc = new Document();
        doc.setApplication(app);
        doc.setDocumentType(DocumentType.BALANCE_SHEET);
        doc.setFileUrl("/docs/id.pdf");
        doc.setDocumentUploadeddAt(LocalDateTime.now());
        doc.setValid(true);
        doc.setSigned(false);

        assertThat(doc.getApplication()).isEqualTo(app);
        assertThat(doc.isValid()).isTrue();
    }

    @Test
    void testTransferEntity() {
        Company company = new Company();
        BankAccount account = new BankAccount();
        Transfer transfer = new Transfer();
        transfer.setCompany(company);
        transfer.setBankAccount(account);
        transfer.setTransferAmount(new BigDecimal("1500.75"));
        transfer.setPurpose(TransferPurpose.OTHER);
        transfer.setTransferStatus(TransferStatus.PENDING);
        transfer.setRequestedAt(LocalDateTime.now());

        assertThat(transfer.getBankAccount()).isEqualTo(account);
        assertThat(transfer.getTransferAmount()).isEqualByComparingTo(new BigDecimal("1500.75"));
    }

    @Test
    void testKycVerificationEntity() {
        User user = new User();
        CreditApplication app = new CreditApplication();
        KycVerification kyc = new KycVerification();
        kyc.setUser(user);
        kyc.setApplication(app);
        kyc.setKycStatus(KYCStatus.PENDING);
        kyc.setProvider(KYCProvider.MOCK);
        kyc.setSubmittedAt(LocalDateTime.now());
        kyc.setRiskScore(5);

        assertThat(kyc.getUser()).isEqualTo(user);
        assertThat(kyc.getRiskScore()).isEqualTo(5);
    }

    @Test
    void testApplicationHistoryEntity() {
        User user = new User();
        CreditApplication app = new CreditApplication();
        ApplicationHistory history = new ApplicationHistory();
        history.setUser(user);
        history.setApplication(app);
        history.setPreviousStatus(CreditStatus.PENDING);
        history.setNewStatus(CreditStatus.APPROVED);
        history.setHistoryChangedAt(LocalDateTime.now());
        history.setComments("Cambio de estado");

        assertThat(history.getComments()).isEqualTo("Cambio de estado");
        assertThat(history.getPreviousStatus()).isEqualTo(CreditStatus.PENDING);
        assertThat(history.getNewStatus()).isEqualTo(CreditStatus.APPROVED);
    }
}
