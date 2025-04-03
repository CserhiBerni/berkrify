module com.example.berkrify {
  requires javafx.controls;
  requires javafx.fxml;
  requires org.bouncycastle.provider;
  requires java.sql;

  opens com.example.berkrify to javafx.graphics, javafx.fxml;
  opens com.example.berkrify.controllers to javafx.fxml;

  exports com.example.berkrify;
  exports com.example.berkrify.controllers;
  exports com.example.berkrify.database;
  exports com.example.berkrify.models;
}
