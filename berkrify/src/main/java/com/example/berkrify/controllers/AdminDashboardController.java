package com.example.berkrify.controllers;

import com.example.berkrify.views.SongDashboard;
import com.example.berkrify.views.UserDashboard;
import javafx.event.ActionEvent;
import javafx.stage.Stage;

public class AdminDashboardController {

  public void handleSongs(ActionEvent event) {
    try {
      new SongDashboard().start(new Stage());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void handleUsers(ActionEvent event) {
    try {
      new UserDashboard().start(new Stage());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}