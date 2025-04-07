package com.example.berkrify.views;

import com.example.berkrify.controllers.SongController;
import com.example.berkrify.controllers.SongUpdateController;
import com.example.berkrify.models.Song;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Parent;
import javafx.scene.Scene;
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

    Button modifyButton = new Button("Modify");
    modifyButton.setOnAction(e -> modifySelectedRecord());

    VBox vbox = new VBox(10, backButton, tableView, deleteButton, modifyButton);
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
    } else {
      showAlert("Selection Error", "Please select a song to delete.");
    }
  }

  private void modifySelectedRecord() {
    Song selected = tableView.getSelectionModel().getSelectedItem();
    if (selected == null) {
      showAlert("Selection Error", "Please select a song to update.");
      return;
    }
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/fxml/song_update.fxml"));
      Parent root = loader.load();

      SongUpdateController controller = loader.getController();
      controller.setSong(selected);

      Stage stage = new Stage();
      stage.setScene(new Scene(root, 400, 300));
      stage.setTitle("Update Song");
      stage.initModality(javafx.stage.Modality.APPLICATION_MODAL);
      stage.showAndWait();

      loadRecords();
    } catch (Exception ex) {
      ex.printStackTrace();
    }
  }

  private void showAlert(String title, String message) {
    Alert alert = new Alert(Alert.AlertType.ERROR);
    alert.setTitle(title);
    alert.setContentText(message);
    alert.showAndWait();
  }
}
