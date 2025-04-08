package com.example.berkrify.util;

import com.example.berkrify.models.Song;
import javafx.collections.ObservableList;
import javafx.stage.FileChooser;
import javafx.stage.Window;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class CSVExporter {
  public static void exportSongsToCSV(ObservableList<Song> songs, Window ownerWindow) {
    File file = getSaveFile(ownerWindow);

    if (file == null) {
      return;
    }

    try (PrintWriter writer = new PrintWriter(new FileWriter(file))) {
      writer.println("ID,Title,Artist,Album");

      for (Song song : songs) {
        writer.println(song.getId() + "," +
            sanitizeForCSV(song.getTitle()) + "," +
            sanitizeForCSV(song.getArtist()) + "," +
            sanitizeForCSV(song.getAlbum()));
      }
      writer.flush();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private static File getSaveFile(Window ownerWindow) {
    FileChooser fileChooser = new FileChooser();
    fileChooser.setTitle("Save CSV File");
    fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files", "*.csv"));

    return fileChooser.showSaveDialog(ownerWindow);
  }

  private static String sanitizeForCSV(String field) {
    if (field == null) {
      return "";
    }

    if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
      field = field.replace("\"", "\"\"");
      field = "\"" + field + "\"";
    }

    return field;
  }
}
