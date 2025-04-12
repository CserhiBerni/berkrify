package com.example.berkrify.dto;

public class UserDto {
  private int id;
  private String name;
  private String email;
  private String password;
  private String profilePicture;
  private String created;
  private String role;

  public UserDto() {
  }

  public int getId() {
    return id;
  }
  public void setId(int id) {
    this.id = id;
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

  public String getProfilePicture() {
    return profilePicture;
  }
  public void setProfilePicture(String profilePicture) {
    this.profilePicture = profilePicture;
  }

  public String getCreated() {
    return created;
  }
  public void setCreated(String created) {
    this.created = created;
  }

  public String getRole() {
    return role;
  }
  public void setRole(String role) {
    this.role = role;
  }
}
