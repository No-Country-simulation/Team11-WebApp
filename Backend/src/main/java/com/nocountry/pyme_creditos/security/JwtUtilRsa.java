package com.nocountry.pyme_creditos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Date;
import java.util.Map;
import org.springframework.core.io.ResourceLoader;

@Component
@RequiredArgsConstructor
public class JwtUtilRsa {

    @Value("${jwt.private-key-path}")
    private String privateKeyPath;

    @Value("${jwt.public-key-path}")
    private String publicKeyPath;

    @Value("${jwt.expiration-minutes}")
    private Long expirationMinutes;

    private final ResourceLoader resourceLoader;

    private PrivateKey privateKey;
    @Getter
    private PublicKey publicKey;

    @PostConstruct
    public void initKeys() throws Exception {
        Resource privateResource = resourceLoader.getResource("classpath:keys/private_key.pem");
        Resource publicResource = resourceLoader.getResource("classpath:keys/public_key.pem");

        byte[] privateBytes = privateResource.getInputStream().readAllBytes();
        byte[] publicBytes = publicResource.getInputStream().readAllBytes();

        String privateContent = new String(privateBytes)
                .replaceAll("-----BEGIN (.*)-----", "")
                .replaceAll("-----END (.*)-----", "")
                .replaceAll("\\s", "");

        String publicContent = new String(publicBytes)
                .replaceAll("-----BEGIN (.*)-----", "")
                .replaceAll("-----END (.*)-----", "")
                .replaceAll("\\s", "");

        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        privateKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(Decoders.BASE64.decode(privateContent)));
        publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(Decoders.BASE64.decode(publicContent)));
    }

    public String generateToken(String email,  Map<String, Object> extraClaims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMinutes * 60 * 1000);

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    public boolean isExpired(String token) {
        try {
            return getClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    public boolean validate(String token, String expectedEmail) {
        try {
            Claims c = getClaims(token);
            return expectedEmail.equals(c.getSubject()) && !isExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public RSAPublicKey getRsaPublicKey() {
        return (RSAPublicKey) publicKey;
    }

}
