package com.example.berkrify.controllers;

import com.example.berkrify.database.DatabaseConnection;
import com.example.berkrify.security.PasswordHasher;
import com.example.berkrify.security.SecurityService;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LoginController {
  @FXML private TextField emailField;
  @FXML private PasswordField passwordField;
  @FXML private Label messageLabel;

  private SecurityService securityService;

  public LoginController() {
    this.securityService = new SecurityService();
  }

  public void handleLogin() {
    String email = emailField.getText();
    String password = passwordField.getText();

    if (validateLogin(email, password)) {
      messageLabel.setText("Login successful!");
      openAdminDashboard();
    } else {
      messageLabel.setText("Access Denied! Only Admins can log in.");
    }
  }

  private boolean validateLogin(String email, String password) {
    String sql = "SELECT role, password FROM user WHERE email = ?";

    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setString(1, email);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
          String role = rs.getString("role");
          String storedHash = rs.getString("password");

          return securityService.verifyPassword(password, storedHash) &&
              securityService.verifyRole(role);
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  private void openAdminDashboard() {
    try {
      Stage stage = (Stage) emailField.getScene().getWindow();
      stage.close();

      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/fxml/admin_dashboard.fxml"));
      Scene scene = new Scene(loader.load(), 650, 400);
      Stage newStage = new Stage();
      newStage.setScene(scene);
      newStage.setTitle("Admin Dashboard");
      newStage.show();

    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
