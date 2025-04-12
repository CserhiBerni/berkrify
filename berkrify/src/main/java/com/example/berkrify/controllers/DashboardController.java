package com.example.berkrify.controllers;

import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class DashboardController {

  public void handleManageSongs(ActionEvent event) throws IOException {
    Stage stage = (Stage)((Node) event.getSource()).getScene().getWindow();
    FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/song_list.fxml"));
    Parent root = loader.load();
    Scene scene = new Scene(root, 650, 400);
    stage.setScene(scene);
    stage.setTitle("Berkrify | Songs");

    SongController songController = loader.getController();
    songController.setStage(stage);
  }


  public void handleManageUsers(ActionEvent event) throws IOException {
    Stage stage = (Stage)((Node) event.getSource()).getScene().getWindow();
    FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/user_list.fxml"));
    Parent root = loader.load();
    Scene scene = new Scene(root, 650, 400);
    stage.setScene(scene);
    stage.setTitle("Berkrify | Users");

    UserController userController = loader.getController();
    userController.setStage(stage);
  }
}
