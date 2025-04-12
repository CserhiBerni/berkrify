package com.example.berkrify.util;

public class Session {
  private static Session instance;
  private String token;

  private Session() { }

  public static Session getInstance() {
    if (instance == null) {
      instance = new Session();
    }
    return instance;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }
}
