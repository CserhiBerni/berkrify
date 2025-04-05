package com.example.berkrify.models;

import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;

public class User {
  private final SimpleIntegerProperty id;
  private final SimpleStringProperty name;
  private final SimpleStringProperty email;
  private final SimpleStringProperty created;

  public User(int id, String name, String email, String created) {
    this.id = new SimpleIntegerProperty(id);
    this.name = new SimpleStringProperty(name);
    this.email = new SimpleStringProperty(email);
    this.created = new SimpleStringProperty(created);
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

  public String getCreated() {
    return created.get();
  }

  public SimpleStringProperty createdProperty() {
    return created;
  }
}
