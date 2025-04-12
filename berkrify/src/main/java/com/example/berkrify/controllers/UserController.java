package com.example.berkrify.controllers;

import com.example.berkrify.models.User;
import com.example.berkrify.services.UserService;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.concurrent.Task;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.stage.Stage;

import java.io.IOException;

public class UserController {

  @FXML
  private TableView<User> usersTable;
  @FXML
  private TableColumn<User, Number> idColumn;
  @FXML
  private TableColumn<User, String> nameColumn;
  @FXML
  private TableColumn<User, String> emailColumn;
  @FXML
  private TableColumn<User, String> passwordColumn;
  @FXML
  private TableColumn<User, String> profilePictureColumn;
  @FXML
  private TableColumn<User, String> createdColumn;
  @FXML
  private TableColumn<User, String> roleColumn;

  private ObservableList<User> userData = FXCollections.observableArrayList();
  private final UserService userService = new UserService();

  private Stage stage;

  public void setStage(Stage stage) {
    this.stage = stage;
  }

  @FXML
  public void initialize() {
    idColumn.setCellValueFactory(cellData -> cellData.getValue().idProperty());
    nameColumn.setCellValueFactory(cellData -> cellData.getValue().nameProperty());
    emailColumn.setCellValueFactory(cellData -> cellData.getValue().emailProperty());
    passwordColumn.setCellValueFactory(cellData -> cellData.getValue().passwordProperty());
    profilePictureColumn.setCellValueFactory(cellData -> cellData.getValue().profilePictureProperty());
    createdColumn.setCellValueFactory(cellData -> cellData.getValue().createdProperty());
    roleColumn.setCellValueFactory(cellData -> cellData.getValue().roleProperty());

    loadUserData();
  }

  private void loadUserData() {
    Task<ObservableList<User>> loadTask = new Task<>() {
      @Override
      protected ObservableList<User> call() throws Exception {
        return FXCollections.observableArrayList(userService.getUsers());
      }
    };

    loadTask.setOnSucceeded(event -> {
      userData.setAll(loadTask.getValue());
      usersTable.setItems(userData);
    });

    loadTask.setOnFailed(event -> {
      loadTask.getException().printStackTrace();
    });

    new Thread(loadTask).start();
  }

  public void handleBack(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/dashboard.fxml"));
      Parent root = loader.load();
      Scene scene = new Scene(root, 650, 400);
      stage.setScene(scene);
      stage.setTitle("Berkrify | Dashboard");
    } catch (IOException ex) {
      ex.printStackTrace();
    }
  }
}
