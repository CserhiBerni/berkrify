package com.example.berkrify.util;

import javafx.application.Platform;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import java.io.IOException;

public class GlobalErrorHandler {

  public static void handleCriticalError(String errorMessage) {
    Session.getInstance().clear();
    Platform.runLater(() -> {
      try {
        FXMLLoader loader = new FXMLLoader(GlobalErrorHandler.class.getResource("/com/example/berkrify/views/login.fxml"));
        Parent loginRoot = loader.load();
        Scene loginScene = new Scene(loginRoot, 700, 450);
        Stage stage = (Stage) loginRoot.getScene().getWindow();
        stage.setScene(loginScene);
        stage.setTitle("Berkrify | Login");
      } catch (IOException e) {
        e.printStackTrace();
      }
    });
  }
}
