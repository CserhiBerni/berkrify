package com.example.berkrify.security;

public class SecurityService {
  public boolean verifyPassword(String password, String storedHash) {
    return PasswordHasher.verifyPassword(password, storedHash);
  }

  public boolean verifyRole(String role) {
    return role.equals("Admin");
  }
}
