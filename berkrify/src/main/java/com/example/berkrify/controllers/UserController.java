package com.example.berkrify.controllers;

import com.example.berkrify.models.User;
import com.example.berkrify.services.UserService;
import com.example.berkrify.util.AlertWindow;
import com.example.berkrify.util.CSVExporter;
import com.example.berkrify.util.Session;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.concurrent.Task;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import javafx.util.Callback;

import java.io.File;
import java.io.IOException;

public class UserController {

  @FXML
  private TextField searchField;
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

  public void setStage(Stage stage) {
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

    FilteredList<User> filteredData = new FilteredList<>(userData, p -> true);

    searchField.textProperty().addListener((observable, oldValue, newValue) -> {
      filteredData.setPredicate(user -> {
        if (newValue == null || newValue.isEmpty()) {
          return true;
        }
        String lowerCaseFilter = newValue.toLowerCase();
        return user.getName() != null && user.getName().toLowerCase().contains(lowerCaseFilter);
      });
    });

    SortedList<User> sortedData = new SortedList<>(filteredData);
    sortedData.comparatorProperty().bind(usersTable.comparatorProperty());

    usersTable.setItems(sortedData);
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
    userData.clear();

    Task<ObservableList<User>> loadTask = new Task<>() {
      @Override
      protected ObservableList<User> call() throws Exception {
        return FXCollections.observableArrayList(userService.getUsers());
      }
    };

    loadTask.setOnSucceeded(event -> {
      userData.setAll(loadTask.getValue());
    });

    loadTask.setOnFailed(event -> {
      AlertWindow alertWindow = new AlertWindow(
          "HTTP Error",
          "HTTP GET Request Failed",
          Alert.AlertType.ERROR);
      alertWindow.showAlert();
    });

    new Thread(loadTask).start();
  }

  @FXML
  public void handleBack(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass()
          .getResource("/com/example/berkrify/views/dashboard.fxml"));
      Parent root = loader.load();

      Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();

      stage.setScene(new Scene(root, 700, 450));
      stage.setTitle("Berkrify | Dashboard");
    } catch (IOException ex) {
      ex.printStackTrace();
    }
  }

  @FXML
  private void handleExport(ActionEvent event) {
    FileChooser fileChooser = new FileChooser();
    fileChooser.setTitle("Export Users to CSV");
    FileChooser.ExtensionFilter extFilter = new FileChooser.ExtensionFilter("CSV files (*.csv)", "*.csv");
    fileChooser.getExtensionFilters().add(extFilter);

    Stage stage = (Stage) usersTable.getScene().getWindow();
    File file = fileChooser.showSaveDialog(stage);
    if (file != null) {
      try {
        CSVExporter.exportUsersToCSV(file, usersTable);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  public void handleRegisterNewUser(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/user_register.fxml"));
      Parent registerRoot = loader.load();

      UserRegisterController registerController = loader.getController();

      Stage registerStage = new Stage();
      registerStage.setTitle("Berkrify | Register New User");
      registerStage.setScene(new Scene(registerRoot, 700, 450));

      registerController.setStage(registerStage);

      registerStage.showAndWait();

      loadUserData();
    } catch (IOException ex) {
      ex.printStackTrace();
    }
  }

  @FXML
  public void handleShowStatistics(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/views/user_statistics.fxml"));
      Parent root = loader.load();
      Stage stage = (Stage)((Node)event.getSource()).getScene().getWindow();
      stage.setScene(new Scene(root, 700, 450));
      stage.setTitle("Berkrify | Role Statistics");
    } catch (IOException e) {
      e.printStackTrace();
      new AlertWindow("Error", "Loading failed", Alert.AlertType.ERROR)
          .showAlert();
    }
  }
}
