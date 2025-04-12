package com.example.berkrify.models;

import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;

public class User {
  private final SimpleIntegerProperty id;
  private final SimpleStringProperty name;
  private final SimpleStringProperty email;
  private final SimpleStringProperty password;
  private final SimpleStringProperty profilePicture;
  private final SimpleStringProperty created;
  private final SimpleStringProperty role;

  public User(int id, String name, String email, String password, String profilePicture, String created, String role) {
    this.id = new SimpleIntegerProperty(id);
    this.name = new SimpleStringProperty(name);
    this.email = new SimpleStringProperty(email);
    this.password = new SimpleStringProperty(password);
    this.profilePicture = new SimpleStringProperty(profilePicture);
    this.created = new SimpleStringProperty(created);
    this.role = new SimpleStringProperty(role);
  }

  public int getId() {
    return id.get();
  }

  public SimpleIntegerProperty idProperty() {
    return id;
  }

  public String getName() {
    return name.get();
  }

  public SimpleStringProperty nameProperty() {
    return name;
  }

  public String getEmail() {
    return email.get();
  }

  public SimpleStringProperty emailProperty() {
    return email;
  }

  public String getPassword() {
    return password.get();
  }

  public SimpleStringProperty passwordProperty() {
    return password;
  }

  public String getProfilePicture() {
    return profilePicture.get();
  }

  public SimpleStringProperty profilePictureProperty() {
    return profilePicture;
  }

  public String getCreated() {
    return created.get();
  }

  public SimpleStringProperty createdProperty() {
    return created;
  }

  public String getRole() {
    return role.get();
  }

  public SimpleStringProperty roleProperty() {
    return role;
  }
}
