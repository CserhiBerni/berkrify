package com.example.berkrify.controllers;

import com.example.berkrify.models.User;
import com.example.berkrify.services.UserService;
import com.example.berkrify.util.AlertWindow;
import com.example.berkrify.util.Session;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.concurrent.Task;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.stage.Stage;
import javafx.util.Callback;

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
  private TableColumn<User, String> roleColumn;
  @FXML
  private TableColumn<User, String> createdColumn;
  @FXML
  private TableColumn<User, Void> actionColumn;

  private final ObservableList<User> userData = FXCollections.observableArrayList();
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
    roleColumn.setCellValueFactory(cellData -> cellData.getValue().roleProperty());
    createdColumn.setCellValueFactory(cellData -> cellData.getValue().createdProperty());

    addDeleteButtonToTable();

    loadUserData();
  }

  private void addDeleteButtonToTable() {
    Callback<TableColumn<User, Void>, TableCell<User, Void>> cellFactory = new Callback<>() {
      @Override
      public TableCell<User, Void> call(final TableColumn<User, Void> param) {
        return new TableCell<>() {

          private final Button btn = new Button("Delete");

          {
            btn.setOnAction(event -> {
              User user = getTableView().getItems().get(getIndex());
              handleDeleteUser(user);
            });
          }

          @Override
          public void updateItem(Void item, boolean empty) {
            super.updateItem(item, empty);
            if (empty) {
              setGraphic(null);
            } else {
              setGraphic(btn);
            }
          }
        };
      }
    };

    actionColumn.setCellFactory(cellFactory);
  }

  private void handleDeleteUser(User user) {
    if (user.getId() == Session.getInstance().getCurrentUserId()) {
      AlertWindow alertWindow = new AlertWindow(
          "Deletion error",
          "You can not delete yourself.",
          Alert.AlertType.ERROR
      );
      alertWindow.showAlert();
      return;
    }

    Task<Void> deleteTask = new Task<>() {
      @Override
      protected Void call() throws Exception {
        userService.deleteUser(user.getId());
        return null;
      }
    };

    deleteTask.setOnSucceeded(event -> {
      userData.remove(user);
    });

    deleteTask.setOnFailed(event -> {
      deleteTask.getException().printStackTrace();
    });

    new Thread(deleteTask).start();
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
      Scene scene = new Scene(root, 700, 450);
      stage.setScene(scene);
      stage.setTitle("Berkrify | Dashboard");
    } catch (IOException ex) {
      ex.printStackTrace();
    }
  }
}
