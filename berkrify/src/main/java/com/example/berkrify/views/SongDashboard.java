package com.example.berkrify.views;

import com.example.berkrify.controllers.SongController;
import com.example.berkrify.models.Song;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Parent;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.scene.Node;
import javafx.stage.Stage;
import javafx.fxml.FXMLLoader;

public class SongDashboard {

  private final SongController songController = new SongController();
  private TableView<Song> tableView;

  public Parent getView() {
    Button backButton = new Button("Back");
    backButton.setOnAction(e -> {
      try {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/fxml/admin_dashboard.fxml"));
        Parent root = loader.load();
        Stage stage = (Stage) ((Node) e.getSource()).getScene().getWindow();
        stage.setScene(new javafx.scene.Scene(root, 650, 400));
        stage.setTitle("Admin Dashboard");
        stage.show();
      } catch (Exception ex) {
        ex.printStackTrace();
      }
    });

    tableView = new TableView<>();
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

    VBox vbox = new VBox(10, backButton, tableView, deleteButton);
    vbox.setPadding(new Insets(10));
    return vbox;
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
