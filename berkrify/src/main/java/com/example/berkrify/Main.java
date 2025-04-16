package com.example.berkrify;

import com.example.berkrify.controllers.LoginController;
import com.example.berkrify.util.GlobalErrorHandler;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

  @Override
  public void start(Stage primaryStage) throws Exception {
    FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/login.fxml"));
    Parent root = loader.load();
    Scene scene = new Scene(root, 700, 450);
    primaryStage.setScene(scene);
    primaryStage.setTitle("Berkrify | Login");

    LoginController loginController = loader.getController();
    loginController.setStage(primaryStage);

    primaryStage.show();
  }

  public static void main(String[] args) {
    Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
      GlobalErrorHandler.handleCriticalError("Critical error occurred: " + throwable.getMessage());
    });
    launch(args);
  }
}
