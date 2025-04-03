package com.example.berkrify;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.net.URL;

public class Main extends Application {
  @Override
  public void start(Stage stage) {
    try {
      URL fxmlLocation = getClass().getResource("/com/example/berkrify/login.fxml");

      if (fxmlLocation == null) {
        throw new RuntimeException("FXML file not found! Check the path.");
      }

      FXMLLoader fxmlLoader = new FXMLLoader(fxmlLocation);
      Scene scene = new Scene(fxmlLoader.load(), 400, 300);
      stage.setTitle("Admin Login");
      stage.setScene(scene);
      stage.show();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }


  public static void main(String[] args) {
    launch(args);
  }
}
