module com.example.berkrify {
  requires javafx.controls;
  requires javafx.fxml;
  requires java.sql;

  opens com.example.berkrify.application to javafx.fxml;

  exports com.example.berkrify.application;
  exports com.example.berkrify.database;
  exports com.example.berkrify.models;
}
