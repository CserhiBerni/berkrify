package com.example.berkrify.dto;

public class CreateUserDto {
  private String name;
  private String email;
  private String password;
  private String role;
  private String created;

  public CreateUserDto() {
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }
  public void setPassword(String password) {
    this.password = password;
  }

  public String getRole() {
    return role;
  }
  public void setRole(String role) {
    this.role = role;
  }

  public String getCreated() {
    return created;
  }
  public void setCreated(String created) {
    this.created = created;
  }
}
