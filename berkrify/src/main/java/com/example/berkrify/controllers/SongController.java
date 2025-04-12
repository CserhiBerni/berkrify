package com.example.berkrify.controllers;

import com.example.berkrify.models.Song;
import com.example.berkrify.services.SongService;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.concurrent.Task;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.stage.Stage;
import javafx.util.Callback;

import java.io.IOException;

public class SongController {

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

  private ObservableList<Song> songData = FXCollections.observableArrayList();
  private final SongService songService = new SongService();

  private Stage stage;

  public void setStage(Stage stage) {
    this.stage = stage;
  }

  public void initialize() {
    idColumn.setCellValueFactory(cellData -> cellData.getValue().idProperty());
    artistColumn.setCellValueFactory(cellData -> cellData.getValue().artistProperty());
    albumColumn.setCellValueFactory(cellData -> cellData.getValue().albumProperty());
    titleColumn.setCellValueFactory(cellData -> cellData.getValue().songProperty());
    lengthColumn.setCellValueFactory(cellData -> cellData.getValue().lengthProperty());

    addDeleteButtonToTable();

    loadSongData();
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
        songService.deleteUser(song.getId());
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
    Task<ObservableList<Song>> loadTask = new Task<>() {
      @Override
      protected ObservableList<Song> call() throws Exception {
        return FXCollections.observableArrayList(songService.getSongs());
      }
    };

    loadTask.setOnSucceeded(event -> {
      songData = loadTask.getValue();
      songsTable.setItems(songData);
    });

    loadTask.setOnFailed(event -> {
      loadTask.getException().printStackTrace();
    });

    new Thread(loadTask).start();
  }

  public void handleBack(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/dashboard.fxml"));
      Parent root = loader.load();
      Scene scene = new Scene(root, 650, 400);
      stage.setScene(scene);
      stage.setTitle("Berkrify | Dashboard");
    } catch (IOException ex) {
      ex.printStackTrace();
    }
  }
}
