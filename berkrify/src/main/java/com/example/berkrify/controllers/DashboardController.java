package com.example.berkrify.controllers;

import com.example.berkrify.util.Session;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.stage.Stage;

import java.io.IOException;

public class DashboardController {

  @FXML
  private Label welcomeLabel;

  @FXML
  public void initialize() {
    String userName = Session.getInstance().getCurrentUserName();
    if (userName != null && !userName.isEmpty()) {
      welcomeLabel.setText("Welcome " + userName + "!");
    } else {
      welcomeLabel.setText("Welcome!");
    }
  }

  public void handleManageSongs(ActionEvent event) throws IOException {
    Stage stage = (Stage)((Node) event.getSource()).getScene().getWindow();
    FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/song_list.fxml"));
    Parent root = loader.load();
    Scene scene = new Scene(root, 700, 450);
    stage.setScene(scene);
    stage.setTitle("Berkrify | Songs");

    SongController songController = loader.getController();
    songController.setStage(stage);
  }


  public void handleManageUsers(ActionEvent event) throws IOException {
    Stage stage = (Stage)((Node) event.getSource()).getScene().getWindow();
    FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/user_list.fxml"));
    Parent root = loader.load();
    Scene scene = new Scene(root, 700, 450);
    stage.setScene(scene);
    stage.setTitle("Berkrify | Users");

    UserController userController = loader.getController();
    userController.setStage(stage);
  }

  public void handleLogout(ActionEvent event) {
    Session.getInstance().setToken(null);
    Session.getInstance().setCurrentUserId(0);

    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/login.fxml"));
      Parent loginRoot = loader.load();
      Scene loginScene = new Scene(loginRoot, 700, 450);

      Stage stage = (Stage)((Node) event.getSource()).getScene().getWindow();
      stage.setScene(loginScene);
      stage.setTitle("Berkrify | Login");

      LoginController loginController = loader.getController();
      loginController.setStage(stage);

      stage.show();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
