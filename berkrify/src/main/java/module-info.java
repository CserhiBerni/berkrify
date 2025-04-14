module com.example.berkrify {
  requires javafx.controls;
  requires javafx.fxml;
  requires java.net.http;
  requires com.fasterxml.jackson.databind;
  requires com.fasterxml.jackson.core;
  requires org.apache.httpcomponents.httpcore;
  requires org.apache.httpcomponents.httpclient;
  requires org.apache.httpcomponents.httpmime;

  opens com.example.berkrify to javafx.fxml;
  opens com.example.berkrify.controllers to javafx.fxml;
  opens com.example.berkrify.dto to com.fasterxml.jackson.databind;
  opens com.example.berkrify.models to com.fasterxml.jackson.databind;

  exports com.example.berkrify.models to com.fasterxml.jackson.databind;
  exports com.example.berkrify;
}
