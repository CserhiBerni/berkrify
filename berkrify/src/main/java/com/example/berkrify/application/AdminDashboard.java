package com.example.berkrify.application;

import com.example.berkrify.models.Song;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class AdminDashboard extends Application {
  private final TableView<Song> tableView = new TableView<>();

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

    VBox vbox = new VBox(tableView);
    Scene scene = new Scene(vbox, 1000, 600);
    stage.setScene(scene);
    stage.setTitle("Admin Dashboard");
    stage.show();
  }
}
