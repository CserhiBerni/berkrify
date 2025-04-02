module com.example.berkrify {
  requires javafx.controls;
  requires javafx.fxml;


  opens com.example.berkrify to javafx.fxml;
  exports com.example.berkrify;
}