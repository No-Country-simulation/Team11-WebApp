package com.nocountry.pyme_creditos.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.nocountry.pyme_creditos.model.Document;

public interface DocumentRepository extends JpaRepository<Document,UUID>{

}
