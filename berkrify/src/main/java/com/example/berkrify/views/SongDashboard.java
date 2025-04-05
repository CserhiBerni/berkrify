package com.example.berkrify.views;

import com.example.berkrify.controllers.SongController;
import com.example.berkrify.models.Song;
import com.example.berkrify.models.User;
import javafx.application.Application;
import javafx.collections.ObservableList;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class SongDashboard extends Application {

  private final TableView<Song> tableView = new TableView<>();
  private final SongController songController = new SongController();

  public static void main(String[] args) {
    launch(args);
  }

  @Override
  public void start(Stage stage) {
    TableColumn<Song, Integer> idColumn = new TableColumn<>("ID");
    idColumn.setCellValueFactory(cellData -> cellData.getValue().idProperty().asObject());

    TableColumn<Song, String> titleColumn = new TableColumn<>("Title");
    titleColumn.setCellValueFactory(cellData -> cellData.getValue().titleProperty());

    TableColumn<Song, String> artistColumn = new TableColumn<>("Artist");
    artistColumn.setCellValueFactory(cellData -> cellData.getValue().artistProperty());

    TableColumn<Song, String> albumColumn = new TableColumn<>("Album");
    albumColumn.setCellValueFactory(cellData -> cellData.getValue().albumProperty());

    tableView.getColumns().addAll(idColumn, titleColumn, artistColumn, albumColumn);

    loadRecords();

    Button deleteButton = new Button("Delete");
    deleteButton.setOnAction(e -> deleteSelectedRecord());

    VBox vbox = new VBox(tableView, deleteButton);
    Scene scene = new Scene(vbox, 650, 400);
    stage.setScene(scene);
    stage.setTitle("Song Dashboard for Admins");
    stage.show();
  }

  private void loadRecords() {
    ObservableList<Song> songs = songController.loadSongs();
    if (songs.isEmpty()) {
      showAlert("Empty list", "There are currently no songs.");
    } else {
      tableView.setItems(songs);
    }
  }

  private void deleteSelectedRecord() {
    Song selected = tableView.getSelectionModel().getSelectedItem();
    if (selected != null) {
      if (songController.deleteSong(selected)) {
        tableView.getItems().remove(selected);
      } else {
        showAlert("Deletion Error", "Could not delete the selected song.");
      }
    }
  }

  private void showAlert(String title, String message) {
    Alert alert = new Alert(Alert.AlertType.ERROR);
    alert.setTitle(title);
    alert.setContentText(message);
    alert.showAndWait();
  }
}
