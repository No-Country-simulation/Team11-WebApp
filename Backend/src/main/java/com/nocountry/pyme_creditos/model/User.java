package com.nocountry.pyme_creditos.model;

import jakarta.persistence.*;
import com.nocountry.pyme_creditos.enums.Roles;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false)
    private String lastName;

    @Setter
    @Column(nullable = false)
    private String dni;

    @Setter
    @Column(nullable = false)
    private String email;

    @Setter
    @Column(nullable = false)
    private String password_hash;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roles roles;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;




}
