package com.example.berkrify.controllers;

import com.example.berkrify.models.AuthResponse;
import com.example.berkrify.services.AuthService;
import com.example.berkrify.util.AlertWindow;
import javafx.concurrent.Task;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;

import java.io.IOException;

public class UserRegisterController {

  @FXML
  private TextField nameField;
  @FXML
  private TextField emailField;
  @FXML
  private PasswordField passwordField;
  @FXML
  private TextField roleField;
  @FXML
  private Label messageLabel;

  private Stage stage;

  private final AuthService authService = new AuthService();

  public void setStage(Stage stage) {
    this.stage = stage;
  }

  @FXML
  public void handleRegister(ActionEvent event) {
    String name = nameField.getText().trim();
    String email = emailField.getText().trim();
    String password = passwordField.getText().trim();
    String role = roleField.getText().trim();

    if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
      messageLabel.setText("Please fill in the required fields.");
      return;
    }

    Task<Void> registerTask = new Task<>() {
      @Override
      protected Void call() throws Exception {
        authService.register(name, email, password, role);
        return null;
      }
    };

    registerTask.setOnSucceeded(e -> {
      AlertWindow alertWindow = new AlertWindow("User Created", "New user registered", Alert.AlertType.CONFIRMATION); alertWindow.showAlert();

      try {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/dashboard.fxml"));
        Parent dashboardRoot = loader.load();
        Scene scene = new Scene(dashboardRoot, 700, 450);
        Stage currentStage = (Stage) nameField.getScene().getWindow();
        currentStage.setScene(scene);
        currentStage.setTitle("Berkrify | Dashboard");
      } catch (IOException ex) {
        ex.printStackTrace();
        messageLabel.setText("Error loading dashboard.");
      }
      if (stage != null) {
        stage.close();
      }
    });

    registerTask.setOnFailed(e -> {
      Throwable ex = registerTask.getException();
      ex.printStackTrace();
      messageLabel.setText("Registration failed: " + ex.getMessage());
    });

    new Thread(registerTask).start();
  }
}
