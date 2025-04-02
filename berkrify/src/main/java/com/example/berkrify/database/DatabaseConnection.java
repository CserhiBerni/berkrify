package com.example.berkrify.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
  private static final String URL = "jdbc:mysql://root:@localhost:3307/songs";
  private static final String USER = "root";
  private static final String PASSWORD = "";

  public static Connection getConnection() {
    try {
      return DriverManager.getConnection(URL, USER, PASSWORD);
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    }
  }
}
