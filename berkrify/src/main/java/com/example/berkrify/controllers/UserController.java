package com.example.berkrify.controllers;

import com.example.berkrify.database.DatabaseConnection;
import com.example.berkrify.models.Song;
import com.example.berkrify.models.User;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserController {
  public ObservableList<User> loadUsers() {
    ObservableList<User> users = FXCollections.observableArrayList();
    String sql = "SELECT * FROM user";

    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement stmt = conn.prepareStatement(sql);
           ResultSet rs = stmt.executeQuery()) {

        while (rs.next()) {
          users.add(new User(
              rs.getInt("id"),
              rs.getString("name"),
              rs.getString("email"),
              rs.getString("created")
          ));
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return users;
  }

  public boolean deleteUsers(User user) {
    String sql = "DELETE FROM user WHERE id = ?";
    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setInt(1, user.getId());
        int affectedRows = ps.executeUpdate();
        return affectedRows > 0;

      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }
}
