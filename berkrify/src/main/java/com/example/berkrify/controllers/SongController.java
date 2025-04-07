package com.example.berkrify.controllers;

import com.example.berkrify.database.DatabaseConnection;
import com.example.berkrify.models.Song;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SongController {
  public ObservableList<Song> loadSongs() {
    ObservableList<Song> songs = FXCollections.observableArrayList();
    String sql = "SELECT * FROM songs";

    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement stmt = conn.prepareStatement(sql);
           ResultSet rs = stmt.executeQuery()) {

        while (rs.next()) {
          songs.add(new Song(
              rs.getInt("id"),
              rs.getString("song"),
              rs.getString("artist"),
              rs.getString("album")
          ));
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return songs;
  }

  public boolean deleteSong(Song song) {
    String sql = "DELETE FROM songs WHERE id = ?";
    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setInt(1, song.getId());
        int affectedRows = ps.executeUpdate();
        return affectedRows > 0;

      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return false;
  }

  public boolean updateSong(int id, String newTitle, String newArtist, String newAlbum) {
    String sql = "UPDATE songs SET song = ?, artist = ?, album = ? WHERE id = ?";
    try (Connection conn = DatabaseConnection.getConnection()) {
      assert conn != null;
      try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, newTitle);
        ps.setString(2, newArtist);
        ps.setString(3, newAlbum);
        ps.setInt(4, id);
        int affectedRows = ps.executeUpdate();
        return affectedRows > 0;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }
}
