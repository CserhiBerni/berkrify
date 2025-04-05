package com.example.berkrify.security;

public class Session {
  private static Session instance;
  private int userId;
  private String email;
  private String role;

  private Session() {}

  public static Session getInstance() {
    if (instance == null) {
      instance = new Session();
    }
    return instance;
  }

  public void setUser(int userId, String email, String role) {
    this.userId = userId;
    this.email = email;
    this.role = role;
  }

  public void clear() {
    instance = null;
  }

  public int getUserId() {
    return userId;
  }

  public String getEmail() {
    return email;
  }

  public String getRole() {
    return role;
  }
}
