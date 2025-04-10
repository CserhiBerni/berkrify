package com.example.berkrify.util;

import com.example.berkrify.models.Song;
import com.example.berkrify.models.User;
import javafx.collections.ObservableList;
import javafx.stage.FileChooser;
import javafx.stage.Window;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

public class CSVExporter {
  public static void exportSongsToCSV(ObservableList<Song> songs, Window ownerWindow) {
    File file = getSaveFile(ownerWindow);

    if (file == null) {
      return;
    }

    try (PrintWriter writer = new PrintWriter(new FileWriter(file))) {
      writer.println("ID,Title,Artist,Album,MP3,Cover");

      for (Song song : songs) {
        writer.println(song.getId() + "," +
            sanitizeForCSV(song.getTitle()) + "," +
            sanitizeForCSV(song.getArtist()) + "," +
            sanitizeForCSV(song.getAlbum()) + "," +
            sanitizeForCSV(song.getMp3()) + "," +
            sanitizeForCSV(song.getCover())
        );
      }
      writer.flush();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static void exportUserToCSV(ObservableList<User> users, Window ownerWindow) {
    File file = getSaveFile(ownerWindow);
    if (file == null) {
      return;
    }

    try (OutputStream os = new FileOutputStream(file)) {
      os.write(0xEF);
      os.write(0xBB);
      os.write(0xBF);

      try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(os, StandardCharsets.UTF_8))) {
        writer.println("ID,Name,Email,Created");

        for (User user : users) {
          writer.println(user.getId() + "," +
              sanitizeForCSV(user.getName()) + "," +
              sanitizeForCSV(user.getEmail()) + "," +
              sanitizeForCSV(user.getCreated()));
        }
        writer.flush();
      }
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
