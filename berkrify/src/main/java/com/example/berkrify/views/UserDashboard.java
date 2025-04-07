package com.example.berkrify.views;

import com.example.berkrify.controllers.UserController;
import com.example.berkrify.models.User;
import com.example.berkrify.security.Session;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Parent;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.scene.Node;
import javafx.stage.Stage;
import javafx.fxml.FXMLLoader;

public class UserDashboard {

  private final UserController userController = new UserController();
  private TableView<User> tableView;

  public Parent getView() {
    Button backButton = new Button("← Back");
    backButton.setOnAction(e -> {
      try {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/berkrify/fxml/admin_dashboard.fxml"));
        Parent root = loader.load();
        Stage stage = (Stage) ((Node) e.getSource()).getScene().getWindow();
        stage.setScene(new javafx.scene.Scene(root, 650, 400));
        stage.setTitle("Admin Dashboard");
        stage.show();
      } catch (Exception ex) {
        ex.printStackTrace();
      }
    });

    tableView = new TableView<>();
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

    VBox vbox = new VBox(10, backButton, tableView, deleteButton);
    vbox.setPadding(new Insets(10));
    return vbox;
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
    } else {
      showAlert("Selection Error", "Please select a user to delete.");
    }
  }

  private void showAlert(String title, String message) {
    Alert alert = new Alert(Alert.AlertType.ERROR);
    alert.setTitle(title);
    alert.setContentText(message);
    alert.showAndWait();
  }
}
