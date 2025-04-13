package com.example.berkrify.util;

import com.example.berkrify.models.User;
import com.example.berkrify.models.Song;
import javafx.scene.control.TableView;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;

public class CSVExporter {

  public static void exportSongsToCSV(File file, TableView<Song> songsTable) throws IOException {
    try (BufferedWriter writer = Files.newBufferedWriter(file.toPath(), StandardCharsets.UTF_8,
        StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {

      writer.write('\uFEFF');

      writer.write("ID,Artist,Album,Song,Length,ReleaseYear,Genre,MP3,Cover,PlayCount,LastPlayed,CreatedAt");
      writer.newLine();

      for (Song song : songsTable.getItems()) {
        String line = song.getId() + "," +
            "\"" + song.getArtist() + "\"," +
            "\"" + song.getAlbum() + "\"," +
            "\"" + song.getSong() + "\"," +
            song.getLength() + "," +
            song.getReleaseYear() + "," +
            "\"" + song.getGenre() + "\"," +
            "\"" + song.getMp3() + "\"," +
            "\"" + song.getCover() + "\"," +
            song.getPlayCount() + "," +
            "\"" + (song.getLastPlayed() == null ? "" : song.getLastPlayed()) + "\"," +
            "\"" + song.getCreatedAt() + "\"";
        writer.write(line);
        writer.newLine();
      }
    }
  }

  public static void exportUsersToCSV(File file, TableView<User> usersTable) throws IOException {
    try (BufferedWriter writer = Files.newBufferedWriter(file.toPath(), StandardCharsets.UTF_8,
        StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {

      writer.write('\uFEFF');

      writer.write("ID,Name,Email,Password,ProfilePicture,Created,Role");
      writer.newLine();

      for (User user : usersTable.getItems()) {
        String line = user.getId() + "," +
            "\"" + user.getName() + "\"," +
            "\"" + user.getEmail() + "\"," +
            "\"" + user.getPassword() + "\"," +
            "\"" + (user.getProfilePicture() == null ? "" : user.getProfilePicture()) + "\"," +
            "\"" + user.getCreated() + "\"," +
            "\"" + user.getRole() + "\"";
        writer.write(line);
        writer.newLine();
      }
    }
  }
}
