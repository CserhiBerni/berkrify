package com.example.berkrify.views;

import com.example.berkrify.database.DatabaseConnection;
import com.example.berkrify.models.User;
import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDashboard extends Application {
  private final TableView<User> tableView = new TableView<>();
  private final ObservableList<User> users = FXCollections.observableArrayList();

  public static void main(String[] args) {
    launch(args);
  }

  @Override
  public void start(Stage stage) {
    TableColumn<User, Integer> idColumn = new TableColumn<>("id");
    idColumn.setCellValueFactory(cellData -> cellData.getValue().idProperty().asObject());

    TableColumn<User, String> nameColumn = new TableColumn<>("name");
    nameColumn.setCellValueFactory(cellData -> cellData.getValue().nameProperty());

    TableColumn<User, String> emailColumn = new TableColumn<>("email");
    emailColumn.setCellValueFactory(cellData -> cellData.getValue().emailProperty());

    TableColumn<User, String> createdColumn = new TableColumn<>("created");
    createdColumn.setCellValueFactory(cellData -> cellData.getValue().createdProperty());

    tableView.getColumns().addAll(idColumn, nameColumn, emailColumn, createdColumn);
    tableView.setItems(users);
    loadRecords();

    Button deleteButton = new Button("Delete");
    deleteButton.setOnAction(e -> deleteSelectedRecord());

    VBox vbox = new VBox(tableView, deleteButton);
    Scene scene = new Scene(vbox, 650, 400);
    stage.setScene(scene);
    stage.setTitle("User Dashboard for admins");
    stage.show();
  }

  private void loadRecords() {
    users.clear();
    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement stmt = conn.prepareStatement("SELECT * FROM user");
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
  }

  private void deleteSelectedRecord() {
    User selected = tableView.getSelectionModel().getSelectedItem();
    if (selected != null) {
      try (Connection conn = DatabaseConnection.getConnection()) {
        assert conn != null;
        try (PreparedStatement ps = conn.prepareStatement("DELETE FROM user WHERE id = ?")) {
          ps.setInt(1, selected.getId());
          ps.executeUpdate();
          users.remove(selected);
        }
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
  }
}
