package com.example.berkrify.controllers;

import com.example.berkrify.models.Song;
import com.example.berkrify.services.SongService;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import javafx.concurrent.Task;

public class SongEditController {

  @FXML
  private TextField artistField;
  @FXML
  private TextField albumField;
  @FXML
  private TextField songField;
  @FXML
  private TextField lengthField;
  @FXML
  private TextField releaseYearField;
  @FXML
  private TextField genreField;
  @FXML
  private TextField mp3Field;
  @FXML
  private TextField coverField;

  private Song song;
  private final SongService songService = new SongService();
  private Stage stage;

  public void setStage(Stage stage) {
    this.stage = stage;
  }

  public void setSong(Song song) {
    this.song = song;
    artistField.setText(song.getArtist());
    albumField.setText(song.getAlbum());
    songField.setText(song.getSong());
    lengthField.setText(String.valueOf(song.getLength()));
    releaseYearField.setText(String.valueOf(song.getReleaseYear()));
    genreField.setText(song.getGenre());
    mp3Field.setText(song.getMp3());
    coverField.setText(song.getCover());
  }

  @FXML
  private void handleSave(ActionEvent event) {
    String artist = artistField.getText();
    String album = albumField.getText();
    String songTitle = songField.getText();
    int length = Integer.parseInt(lengthField.getText());
    int releaseYear = Integer.parseInt(releaseYearField.getText());
    String genre = genreField.getText();
    String mp3 = mp3Field.getText();
    String cover = coverField.getText();

    Song updatedSong = new Song(song.getId(), artist, album, songTitle, length, releaseYear, genre, mp3, cover, song.getPlayCount(), song.getLastPlayed(), song.getCreatedAt());

    Task<Void> updateTask = new Task<>() {
      @Override
      protected Void call() throws Exception {
        songService.updateSong(updatedSong);
        return null;
      }
    };

    updateTask.setOnSucceeded(e -> {
      stage.close();
    });

    updateTask.setOnFailed(e -> {
      updateTask.getException().printStackTrace();
    });

    new Thread(updateTask).start();
  }

  @FXML
  private void handleCancel(ActionEvent event) {
    stage.close();
  }
}

