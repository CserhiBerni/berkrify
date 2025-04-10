package com.example.berkrify.controllers;

import com.example.berkrify.models.Song;
import javafx.fxml.FXML;
import javafx.scene.control.TextField;
import javafx.scene.control.Alert;
import javafx.stage.Stage;

public class SongUpdateController {

  @FXML private TextField titleField;
  @FXML private TextField artistField;
  @FXML private TextField albumField;
  @FXML private TextField mp3Field;
  @FXML private TextField coverField;

  private Song song;
  private final SongController songController = new SongController();

  public void setSong(Song song) {
    this.song = song;
    titleField.setText(song.getTitle());
    artistField.setText(song.getArtist());
    albumField.setText(song.getAlbum());
    mp3Field.setText(song.getMp3());
    coverField.setText(song.getCover());
  }

  @FXML
  public void handleUpdate() {
    String newTitle = titleField.getText();
    String newArtist = artistField.getText();
    String newAlbum = albumField.getText();
    String newMp3 = mp3Field.getText();
    String newCover = coverField.getText();

    boolean success = songController.updateSong(song.getId(), newTitle, newArtist, newAlbum, newMp3, newCover);
    if (success) {
      showAlert("Success", "Song updated successfully.");
      closeWindow();
    } else {
      showAlert("Error", "Failed to update the song.");
    }
  }

  @FXML
  public void handleCancel() {
    closeWindow();
  }

  private void closeWindow() {
    Stage stage = (Stage) titleField.getScene().getWindow();
    stage.close();
  }

  private void showAlert(String title, String message) {
    Alert alert = new Alert(Alert.AlertType.INFORMATION);
    alert.setTitle(title);
    alert.setContentText(message);
    alert.showAndWait();
  }
}
