package com.example.berkrify.util;

public class Session {
  private static Session instance;
  private String token;
  private int currentUserId;
  private String currentUserName;

  private Session() { }

  public static Session getInstance() {
    if (instance == null) {
      instance = new Session();
    }
    return instance;
  }

  public void clear() {
    instance = null;
    token = "";
    currentUserId = 0;
    currentUserName = "";
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public int getCurrentUserId() {
    return currentUserId;
  }

  public void setCurrentUserId(int currentUserId) {
    this.currentUserId = currentUserId;
  }

  public String getCurrentUserName() {
    return currentUserName;
  }

  public void setCurrentUserName(String currentUserName) {
    this.currentUserName = currentUserName;
  }
}
