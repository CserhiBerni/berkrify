package com.example.berkrify.controllers;

import com.example.berkrify.util.AlertWindow;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Label;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.File;
import java.io.IOException;

public class FileUploadController {

  @FXML
  private Label statusLabel;

  @FXML
  public void handleUploadMp3(ActionEvent event) {
    FileChooser fileChooser = new FileChooser();
    fileChooser.setTitle("Select MP3 File");
    fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("MP3 Files", "*.mp3"));
    Stage stage = (Stage) statusLabel.getScene().getWindow();
    File file = fileChooser.showOpenDialog(stage);
    if (file != null) {
      try {
        String result = uploadFile(file, "/songs/upload/mp3");
        AlertWindow alertWindow = new AlertWindow(
            "Upload successful", "MP3 upload successful: " + result,
            Alert.AlertType.CONFIRMATION
        );
        alertWindow.showAlert();
      } catch (IOException e) {
        e.printStackTrace();
        AlertWindow alertWindow = new AlertWindow(
            "Upload failed", "MP3 upload failed: " + e.getMessage(),
            Alert.AlertType.ERROR
        );
        alertWindow.showAlert();
      }
    }
  }

  @FXML
  public void handleUploadCover(ActionEvent event) {
    FileChooser fileChooser = new FileChooser();
    fileChooser.setTitle("Select Cover Image");
    fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Image Files", "*.png", "*.jpg", "*.jpeg"));
    Stage stage = (Stage) statusLabel.getScene().getWindow();
    File file = fileChooser.showOpenDialog(stage);
    if (file != null) {
      try {
        String result = uploadFile(file, "/songs/upload/cover");
        AlertWindow alertWindow = new AlertWindow(
            "Upload successful", "Cover upload successful: " + result,
            Alert.AlertType.CONFIRMATION
        );
        alertWindow.showAlert();
      } catch (IOException e) {
        e.printStackTrace();
        AlertWindow alertWindow = new AlertWindow(
            "Upload failed", "Cover upload failed: " + e.getMessage(),
            Alert.AlertType.ERROR
        );
        alertWindow.showAlert();
      }
    }
  }

  private String uploadFile(File file, String endpointPath) throws IOException {
    String SERVER_URL = "http://localhost:3000";
    String url = SERVER_URL + endpointPath;
    try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
      HttpPost uploadRequest = new HttpPost(url);

      HttpEntity multipartEntity = MultipartEntityBuilder.create()
          .addBinaryBody("file", file, ContentType.DEFAULT_BINARY, file.getName())
          .build();
      uploadRequest.setEntity(multipartEntity);

      HttpResponse response = httpClient.execute(uploadRequest);
      int status = response.getStatusLine().getStatusCode();
      if (status == 200 || status == 201) {
        return file.getName();
      } else {
        throw new IOException("Failed to upload file, status code: " + status);
      }
    }
  }

  @FXML
  public void handleCancel() {
    Stage stage = (Stage) statusLabel.getScene().getWindow();
    stage.close();
  }
}
