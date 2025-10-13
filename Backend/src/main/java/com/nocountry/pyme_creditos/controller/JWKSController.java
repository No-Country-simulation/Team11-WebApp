package com.nocountry.pyme_creditos.controller;

import com.nocountry.pyme_creditos.security.JwtUtilRsa;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigInteger;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.Map;

/*
* Esta clase es para que los servicios externos si tuvieramos tomen la key automaticamente.
* Expone public key en formato JWK (/.well-known/jwks.json) ya que estamos usando RSA para la autenticacion
* */

@RestController
public class JWKSController {

    private final JwtUtilRsa jwtUtilRsa;

    public JWKSController(JwtUtilRsa jwtUtilRsa) {
        this.jwtUtilRsa = jwtUtilRsa;
    }

    @GetMapping(value = "/auth/.well-known/jwks.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> jwks() {
        RSAPublicKey pub = (RSAPublicKey) jwtUtilRsa.getPublicKey();

        // n (modulus) y e (exponent) en base64url sin padding
        String n = base64Url(pub.getModulus());
        String e = base64Url(pub.getPublicExponent());

        // kid: simple hash corto
        String kid = generateKid(pub);

        Map<String, Object> jwk = Map.of(
                "kty", "RSA",
                "alg", "RS256",
                "use", "sig",
                "kid", kid,
                "n", n,
                "e", e
        );

        return Map.of("keys", new Map[] { jwk });
    }

    private String base64Url(BigInteger bigInt) {
        byte[] bytes = toUnsigned(bigInt);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private byte[] toUnsigned(BigInteger bi) {
        byte[] b = bi.toByteArray();
        if (b.length > 1 && b[0] == 0) {
            byte[] tmp = new byte[b.length - 1];
            System.arraycopy(b, 1, tmp, 0, tmp.length);
            return tmp;
        }
        return b;
    }

    private String generateKid(RSAPublicKey pub) {
        try {
            byte[] keyBytes = pub.getEncoded();
            byte[] hash = java.security.MessageDigest.getInstance("SHA-256").digest(keyBytes);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash).substring(0, 8);
        } catch (Exception e) {
            return "kid-unknown";
        }
    }
}
