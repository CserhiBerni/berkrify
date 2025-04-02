package com.example.berkrify.models;

import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;

public class Song {
  private final SimpleIntegerProperty id;
  private final SimpleStringProperty title;
  private final SimpleStringProperty artist;
  private final SimpleStringProperty album;

  public Song(int id, String title, String artist, String album) {
    this.id = new SimpleIntegerProperty(id);
    this.title = new SimpleStringProperty(title);
    this.artist = new SimpleStringProperty(artist);
    this.album = new SimpleStringProperty(album);
  }

  public int getId() {
    return id.get();
  }

  public SimpleIntegerProperty idProperty() {
    return id;
  }

  public String getTitle() {
    return title.get();
  }

  public SimpleStringProperty titleProperty() {
    return title;
  }

  public String getArtist() {
    return artist.get();
  }

  public SimpleStringProperty artistProperty() {
    return artist;
  }

  public String getAlbum() {
    return album.get();
  }

  public SimpleStringProperty albumProperty() {
    return album;
  }
}
