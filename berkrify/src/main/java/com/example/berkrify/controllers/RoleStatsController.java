package com.example.berkrify.controllers;

import com.example.berkrify.models.User;
import com.example.berkrify.services.UserService;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.chart.PieChart;
import javafx.stage.Stage;
import javafx.fxml.FXMLLoader;
import javafx.event.ActionEvent;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class RoleStatsController {

  @FXML private PieChart roleChart;
  private final UserService userService = new UserService();

  @FXML
  public void initialize() {
    Task<List<User>> loadUsers = new Task<>() {
      @Override
      protected List<User> call() throws Exception {
        return userService.getUsers();
      }
    };

    loadUsers.setOnSucceeded(e -> {
      List<User> users = loadUsers.getValue();
      Map<String, Long> counts = users.stream()
          .collect(Collectors.groupingBy(User::getRole, Collectors.counting()));

      roleChart.getData().clear();
      counts.forEach((role, cnt) ->
          roleChart.getData().add(new PieChart.Data(role, cnt))
      );
    });

    loadUsers.setOnFailed(e -> {
      loadUsers.getException().printStackTrace();
    });

    new Thread(loadUsers).start();
  }

  @FXML
  public void handleBack(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/user_list.fxml"));
      Parent root = loader.load();
      Stage stage = (Stage) ((Node)event.getSource()).getScene().getWindow();
      stage.setScene(new Scene(root, 700, 450));
      stage.setTitle("Berkrify | Users");
    } catch (IOException ex) {
      ex.printStackTrace();
    }
  }
}
