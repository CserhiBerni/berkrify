package com.example.berkrify.controllers;

import com.example.berkrify.models.AuthResponse;
import com.example.berkrify.services.AuthService;
import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

public class LoginController {

  public TextField emailField;
  public PasswordField passwordField;
  public Label errorLabel;

  private Stage primaryStage;
  private final AuthService authService = new AuthService();

  public void setStage(Stage stage) {
    this.primaryStage = stage;
  }

  public void handleLogin(ActionEvent event) {
    errorLabel.setText("");
    String email = emailField.getText();
    String password = passwordField.getText();

    new Thread(() -> {
      try {
        AuthResponse authResponse = authService.login(email, password);
        if (authResponse != null && authResponse.getToken() != null) {
          openDashboard();
        }
      } catch (Exception e) {
        e.printStackTrace();
        javafx.application.Platform.runLater(() -> errorLabel.setText("Invalid credentials or error occurred."));
      }
    }).start();
  }

  private void openDashboard() {
    javafx.application.Platform.runLater(() -> {
      try {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/dashboard.fxml"));
        Parent dashboardRoot = loader.load();
        Scene dashboardScene = new Scene(dashboardRoot, 700, 450);
        primaryStage.setScene(dashboardScene);
        primaryStage.setTitle("Berkrify | Dashboard");
      } catch (Exception e) {
        e.printStackTrace();
        errorLabel.setText("Failed to load dashboard.");
      }
    });
  }
}
