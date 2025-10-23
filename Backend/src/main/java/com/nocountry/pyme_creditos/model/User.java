package com.nocountry.pyme_creditos.model;

import jakarta.persistence.*;
import com.nocountry.pyme_creditos.enums.Roles;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@Table(name = "users")
public class User  implements UserDetails { // ✅ Implementar UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

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

    // ✅ AGREGAR ESTOS METODOS DE UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + roles.name()));
    }

    @Override
    public String getPassword() {
        return password_hash; // ✅ Spring Security usa este metodo
    }

    @Override
    public String getUsername() {
        return email; // ✅ Spring Security usa el email como username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;


    }
}