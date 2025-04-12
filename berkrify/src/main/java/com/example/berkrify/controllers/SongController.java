package com.example.berkrify.controllers;

import com.example.berkrify.models.Song;
import com.example.berkrify.services.SongService;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;

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

  private ObservableList<Song> songData = FXCollections.observableArrayList();
  private final SongService songService = new SongService();

  public void initialize() {
    idColumn.setCellValueFactory(cellData -> cellData.getValue().idProperty());
    artistColumn.setCellValueFactory(cellData -> cellData.getValue().artistProperty());
    albumColumn.setCellValueFactory(cellData -> cellData.getValue().albumProperty());
    titleColumn.setCellValueFactory(cellData -> cellData.getValue().songProperty());
    lengthColumn.setCellValueFactory(cellData -> cellData.getValue().lengthProperty());

    loadSongData();
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
}
