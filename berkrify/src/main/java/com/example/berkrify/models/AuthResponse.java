package com.example.berkrify.models;

public class AuthResponse {
  private String token;
  private int userId;

  public AuthResponse() {
  }

  public String getToken() {
    return token;
  }
  public void setToken(String token) {
    this.token = token;
  }

  public int getUserId() {
    return userId;
  }
  public void setUserId(int userId) {
    this.userId = userId;
  }
}
