package com.example.berkrify.controllers;

import com.example.berkrify.models.Song;
import com.example.berkrify.services.SongService;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.stage.Stage;
import javafx.fxml.FXMLLoader;
import javafx.event.ActionEvent;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class GenreStatsController {

  @FXML private BarChart<Number, String> genreChart;
  @FXML private NumberAxis xAxis;
  @FXML private CategoryAxis yAxis;

  private final SongService songService = new SongService();

  @FXML
  public void initialize() {
    Task<List<Song>> load = new Task<>() {
      @Override
      protected List<Song> call() throws Exception {
        return songService.getSongs();
      }
    };

    load.setOnSucceeded(ev -> {
      List<Song> songs = load.getValue();
      Map<String, Long> counts = songs.stream()
          .collect(Collectors.groupingBy(Song::getGenre, Collectors.counting()));
      List<Map.Entry<String, Long>> sorted = counts.entrySet().stream()
          .sorted(Map.Entry.<String,Long>comparingByValue().reversed())
          .toList();

      LinkedHashMap<String, Long> finalMap = new LinkedHashMap<>();
      long others = 0;
      for (int i = 0; i < sorted.size(); i++) {
        if (i < 8) {
          finalMap.put(sorted.get(i).getKey(), sorted.get(i).getValue());
        } else {
          others += sorted.get(i).getValue();
        }
      }
      if (others > 0) finalMap.put("Other", others);

      yAxis.setCategories(javafx.collections.FXCollections.observableArrayList(finalMap.keySet()));

      XYChart.Series<Number, String> series = new XYChart.Series<>();
      series.setName("Songs per Genre");
      finalMap.forEach((genre, count) -> {
        series.getData().add(new XYChart.Data<>(count, genre));
      });

      genreChart.getData().setAll(series);
    });

    load.setOnFailed(ev -> load.getException().printStackTrace());
    new Thread(load).start();
  }

  @FXML
  public void handleBack(ActionEvent event) {
    try {
      FXMLLoader loader = new FXMLLoader(getClass().getResource(
          "/com/example/berkrify/views/song_list.fxml"));
      Parent root = loader.load();
      Stage st = (Stage) genreChart.getScene().getWindow();
      st.setScene(new Scene(root, 700, 450));
      st.setTitle("Berkrify | Songs");
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
