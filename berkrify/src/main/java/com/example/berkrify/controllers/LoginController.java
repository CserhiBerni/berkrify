package com.example.berkrify.controllers;

import com.example.berkrify.application.AdminDashboard;
import com.example.berkrify.database.DatabaseConnection;
import com.example.berkrify.security.PasswordHasher;
import javafx.fxml.FXML;
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

  public void handleLogin() {
    String email = emailField.getText();
    String password = passwordField.getText();

    if (email.equals("admin") && password.equals("admin")) {
      messageLabel.setText("Temporary login successful!");
      openAdminDashboard();
    }

    if (validateLogin(email, password)) {
      messageLabel.setText("Login successful!");
      openAdminDashboard();
    } else {
      messageLabel.setText("Access Denied! Only Admins can log in.");
    }
  }

  private boolean validateLogin(String email, String password) {
    String sql = "SELECT role, password FROM user WHERE email = ? AND password = ?";

    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, email);
        ps.setString(2, password);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
          String role = rs.getString("role");
          return "Admin".equals(role);
        }

        if (rs.next()) {
          String hashedPassword = rs.getString("password");
          return PasswordHasher.verifyPassword(password, hashedPassword);
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

      AdminDashboard adminDashboard = new AdminDashboard();
      adminDashboard.start(new Stage());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
