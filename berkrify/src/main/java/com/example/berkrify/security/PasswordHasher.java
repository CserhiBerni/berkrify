package com.example.berkrify.security;

import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;

public class PasswordHasher {

  public static boolean verifyPassword(String password, String storedHash) {
    try {
      String[] parts = storedHash.split("\\$");
      if (parts.length < 6) {
        System.err.println("Invalid Argon2 hash format");
        return false;
      }

      byte[] salt = Base64.getDecoder().decode(parts[4]);
      byte[] expectedHash = Base64.getDecoder().decode(parts[5]);

      byte[] computedHash = hashPassword(password, salt, expectedHash.length);

      return Arrays.equals(computedHash, expectedHash);
    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }

  private static byte[] hashPassword(String password, byte[] salt, int hashLength) {
    Argon2Parameters.Builder builder = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
        .withSalt(salt)
        .withIterations(3)
        .withMemoryAsKB(65536)
        .withParallelism(4);

    Argon2BytesGenerator generator = new Argon2BytesGenerator();
    generator.init(builder.build());

    byte[] hash = new byte[hashLength];
    generator.generateBytes(password.getBytes(StandardCharsets.UTF_8), hash);
    return hash;
  }
}
