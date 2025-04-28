package com.example.berkrify.controllers;

import com.example.berkrify.models.Song;
import com.example.berkrify.services.SongService;
import com.example.berkrify.util.AlertWindow;
import com.example.berkrify.util.CSVExporter;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.concurrent.Task;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import javafx.util.Callback;

import java.io.File;
import java.io.IOException;

public class SongController {

  @FXML
  private TextField searchField;
  @FXML
  private TableView<Song> songsTable;
  @FXML
  private TableColumn<Song, Number> idColumn;
  @FXML
  private TableColumn<Song, String> artistColumn;
  @FXML
  private TableColumn<Song, String> albumColumn;
  @FXML
  private TableColumn<Song, String> titleColumn;
  @FXML
  private TableColumn<Song, Number> lengthColumn;
  @FXML
  private TableColumn<Song, Void> actionColumn;
  @FXML
  private TableColumn<Song, Void> editColumn;

  private final ObservableList<Song> songData = FXCollections.observableArrayList();
  private final SongService songService = new SongService();

  public void setStage(Stage stage) {
  }

  public void initialize() {
    idColumn.setCellValueFactory(cellData -> cellData.getValue().idProperty());
    artistColumn.setCellValueFactory(cellData -> cellData.getValue().artistProperty());
    albumColumn.setCellValueFactory(cellData -> cellData.getValue().albumProperty());
    titleColumn.setCellValueFactory(cellData -> cellData.getValue().songProperty());
    lengthColumn.setCellValueFactory(cellData -> cellData.getValue().lengthProperty());

    addDeleteButtonToTable();
    addEditButtonToTable();

    loadSongData();

    FilteredList<Song> filteredData = new FilteredList<>(songData, p -> true);

    searchField.textProperty().addListener((observable, oldValue, newValue) -> {
      filteredData.setPredicate(song -> {
        if (newValue == null || newValue.isEmpty()) {
          return true;
        }
        String lowerCaseFilter = newValue.toLowerCase();
        return song.getSong() != null && song.getSong().toLowerCase().contains(lowerCaseFilter);
      });
    });

    SortedList<Song> sortedData = new SortedList<>(filteredData);
    sortedData.comparatorProperty().bind(songsTable.comparatorProperty());

    songsTable.setItems(sortedData);
  }

  private void addDeleteButtonToTable() {
    Callback<TableColumn<Song, Void>, TableCell<Song, Void>> cellFactory = new Callback<>() {
      @Override
      public TableCell<Song, Void> call(final TableColumn<Song, Void> param) {
        return new TableCell<>() {

          private final Button btn = new Button("Delete");

          {
            btn.setOnAction(event -> {
              Song song = getTableView().getItems().get(getIndex());
              handleDeleteSong(song);
            });
          }

          @Override
          public void updateItem(Void item, boolean empty) {
            super.updateItem(item, empty);
            if (empty) {
              setGraphic(null);
            } else {
              setGraphic(btn);
            }
          }
        };
      }
    };

    actionColumn.setCellFactory(cellFactory);
  }

  private void handleDeleteSong(Song song) {
    Task<Void> deleteTask = new Task<>() {
      @Override
      protected Void call() throws Exception {
        songService.deleteSong(song.getId());
        return null;
      }
    };

    deleteTask.setOnSucceeded(event -> {
      songData.remove(song);
    });

    deleteTask.setOnFailed(event -> {
      deleteTask.getException().printStackTrace();
    });

    new Thread(deleteTask).start();
  }

  private void loadSongData() {
    songData.clear();

    Task<ObservableList<Song>> loadTask = new Task<>() {
      @Override
      protected ObservableList<Song> call() throws Exception {
        return FXCollections.observableArrayList(songService.getSongs());
      }
    };

    loadTask.setOnSucceeded(event -> {
      songData.setAll(loadTask.getValue());
    });

    loadTask.setOnFailed(event -> {
      AlertWindow alertWindow = new AlertWindow(
          "HTTP Error",
          "HTTP GET Request Failed",
          Alert.AlertType.ERROR);
      alertWindow.showAlert();
    });

    new Thread(loadTask).start();
  }

  @FXML
  public void handleBack(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass()
          .getResource("/com/example/berkrify/views/dashboard.fxml"));
      Parent root = loader.load();

      Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();

      stage.setScene(new Scene(root, 700, 450));
      stage.setTitle("Berkrify | Dashboard");
    } catch (IOException ex) {
      ex.printStackTrace();
    }
  }

  private void addEditButtonToTable() {
    Callback<TableColumn<Song, Void>, TableCell<Song, Void>> cellFactory = new Callback<>() {
      @Override
      public TableCell<Song, Void> call(final TableColumn<Song, Void> param) {
        return new TableCell<>() {

          private final Button btn = new Button("Edit");

          {
            btn.setOnAction(event -> {
              Song song = getTableView().getItems().get(getIndex());
              openSongEditWindow(song);
            });
          }

          @Override
          public void updateItem(Void item, boolean empty) {
            super.updateItem(item, empty);
            if (empty) {
              setGraphic(null);
            } else {
              setGraphic(btn);
            }
          }
        };
      }
    };
    editColumn.setCellFactory(cellFactory);
  }

  private void openSongEditWindow(Song song) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/song_edit.fxml"));
      Parent root = loader.load();

      SongEditController controller = loader.getController();
      controller.setSong(song);

      Stage editStage = new Stage();
      editStage.setTitle("Berkrify | Edit Song");
      editStage.setScene(new Scene(root, 700, 450));

      controller.setStage(editStage);

      editStage.showAndWait();

      loadSongData();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @FXML
  private void handleExport(ActionEvent event) {
    FileChooser fileChooser = new FileChooser();
    fileChooser.setTitle("Export Songs to CSV");
    FileChooser.ExtensionFilter extFilter = new FileChooser.ExtensionFilter("CSV files (*.csv)", "*.csv");
    fileChooser.getExtensionFilters().add(extFilter);

    Stage stage = (Stage) songsTable.getScene().getWindow();
    File file = fileChooser.showSaveDialog(stage);
    if (file != null) {
      try {
        CSVExporter.exportSongsToCSV(file, songsTable);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  @FXML
  public void handleUploadFiles(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/file_upload.fxml"));
      Parent root = loader.load();
      Stage uploadStage = new Stage();
      uploadStage.setTitle("Berkfify | Upload Files");
      uploadStage.setScene(new Scene(root, 700, 450));
      uploadStage.showAndWait();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @FXML
  public void handleShowStatistics(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource(
          "/com/example/berkrify/views/song_statistics.fxml"
      ));
      Parent root = loader.load();
      Stage stage = (Stage) songsTable.getScene().getWindow();
      stage.setScene(new Scene(root, 700, 450));
      stage.setTitle("Berkrify | Statistics");
    } catch (IOException e) {
      e.printStackTrace();
      AlertWindow alertWindow = new AlertWindow(
          "Error", "Loading failed", Alert.AlertType.ERROR
      );
      alertWindow.showAlert();
    }
  }
}
