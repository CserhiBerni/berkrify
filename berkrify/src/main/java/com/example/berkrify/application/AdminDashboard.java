package com.example.berkrify.application;

import com.example.berkrify.database.DatabaseConnection;
import com.example.berkrify.models.Song;
import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AdminDashboard extends Application {
  private final TableView<Song> tableView = new TableView<>();
  private final ObservableList<Song> songs = FXCollections.observableArrayList();

  public static void main(String[] args) {
    launch(args);
  }

  @Override
  public void start(Stage stage) {
    TableColumn<Song, Integer> idColumn = new TableColumn<>("id");
    idColumn.setCellValueFactory(cellData -> cellData.getValue().idProperty().asObject());

    TableColumn<Song, String> titleColumn = new TableColumn<>("title");
    titleColumn.setCellValueFactory(cellData -> cellData.getValue().titleProperty());

    TableColumn<Song, String> artistColumn = new TableColumn<>("artist");
    artistColumn.setCellValueFactory(cellData -> cellData.getValue().artistProperty());

    TableColumn<Song, String> albumColumn = new TableColumn<>("album");
    albumColumn.setCellValueFactory(cellData -> cellData.getValue().albumProperty());

    tableView.getColumns().addAll(idColumn, titleColumn, artistColumn, albumColumn);
    tableView.setItems(songs);
    loadRecords();

    VBox vbox = new VBox(tableView);
    Scene scene = new Scene(vbox, 650, 400);
    stage.setScene(scene);
    stage.setTitle("Admin Dashboard");
    stage.show();
  }

  private void loadRecords() {
    songs.clear();
    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement stmt = conn.prepareStatement("SELECT * FROM songs");
           ResultSet rs = stmt.executeQuery()) {
        while (rs.next()) {
          songs.add(new Song(
              rs.getInt("id"),
              rs.getString("song"),
              rs.getString("artist"),
              rs.getString("album")
          ));
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }
}
