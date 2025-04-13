package com.example.berkrify.util;

import javafx.scene.control.Alert;

public class AlertWindow {
  private final String title;
  private final String message;
  private final Alert.AlertType alertType;

  public AlertWindow(String title, String message, Alert.AlertType alertType) {
    this.title = title;
    this.message = message;
    this.alertType = alertType;
  }

  public void showAlert() {
    Alert alert = new Alert(alertType);
    alert.setTitle(title);
    alert.setContentText(message);
    alert.showAndWait();
  }
}
