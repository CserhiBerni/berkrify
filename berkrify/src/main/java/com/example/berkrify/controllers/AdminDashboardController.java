package com.example.berkrify.controllers;

import com.example.berkrify.security.Session;
import com.example.berkrify.views.SongDashboard;
import com.example.berkrify.views.UserDashboard;
import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class AdminDashboardController {

  public void handleSongs(ActionEvent event) {
    try {
      SongDashboard songDashboard = new SongDashboard();
      Parent root = songDashboard.getView();
      Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
      stage.setScene(new Scene(root, 650, 400));
      stage.setTitle("Song Dashboard");
      stage.show();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void handleUsers(ActionEvent event) {
    try {
      UserDashboard userDashboard = new UserDashboard();
      Parent root = userDashboard.getView();
      Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
      stage.setScene(new Scene(root, 650, 400));
      stage.setTitle("User Dashboard");
      stage.show();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void handleLogout(ActionEvent event) {
    Session.getInstance().clear();

    Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
    stage.close();

    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/fxml/login.fxml"));
      Scene scene = new Scene(loader.load(), 650, 400);
      Stage loginStage = new Stage();
      loginStage.setScene(scene);
      loginStage.setTitle("Login");
      loginStage.show();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}