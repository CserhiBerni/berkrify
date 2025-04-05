package com.example.berkrify.views;

import com.example.berkrify.controllers.SongController;
import com.example.berkrify.controllers.UserController;
import com.example.berkrify.models.Song;
import com.example.berkrify.models.User;
import com.example.berkrify.security.Session;
import javafx.application.Application;
import javafx.collections.ObservableList;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class UserDashboard extends Application {
  private final TableView<User> tableView = new TableView<>();
  private final UserController userController = new UserController();

  public static void main(String[] args) {
    launch(args);
  }

  @Override
  public void start(Stage stage) {
    TableColumn<User, Integer> idColumn = new TableColumn<>("ID");
    idColumn.setCellValueFactory(cellData -> cellData.getValue().idProperty().asObject());

    TableColumn<User, String> nameColumn = new TableColumn<>("Name");
    nameColumn.setCellValueFactory(cellData -> cellData.getValue().nameProperty());

    TableColumn<User, String> emailColumn = new TableColumn<>("Email");
    emailColumn.setCellValueFactory(cellData -> cellData.getValue().emailProperty());

    TableColumn<User, String> createdColumn = new TableColumn<>("Created");
    createdColumn.setCellValueFactory(cellData -> cellData.getValue().createdProperty());

    tableView.getColumns().addAll(idColumn, nameColumn, emailColumn, createdColumn);

    loadRecords();

    Button deleteButton = new Button("Delete");
    deleteButton.setOnAction(e -> deleteSelectedRecord());

    VBox vbox = new VBox(tableView, deleteButton);
    Scene scene = new Scene(vbox, 650, 400);
    stage.setScene(scene);
    stage.setTitle("User Dashboard for admins");
    stage.show();
  }

  private void loadRecords() {
    ObservableList<User> users = userController.loadUsers();
    if (users.isEmpty()) {
      showAlert("Empty list", "There are currently no users.");
    } else {
      tableView.setItems(users);
    }
  }

  private void deleteSelectedRecord() {
    User selected = tableView.getSelectionModel().getSelectedItem();
    if (selected != null) {
      if (selected.getId() == Session.getInstance().getUserId()) {
        showAlert("Permission Denied", "You cannot delete your own account.");
        return;
      }

      if (userController.deleteUsers(selected)) {
        tableView.getItems().remove(selected);
      } else {
        showAlert("Deletion Error", "Could not delete the selected user.");
      }
    }
  }

  private void showAlert(String title, String message) {
    Alert alert = new Alert(Alert.AlertType.ERROR);
    alert.setTitle(title);
    alert.setContentText(message);
    alert.showAndWait();
  }
}
