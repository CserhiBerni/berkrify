package com.example.berkrify.models;

import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;

public class Song {
  private final SimpleIntegerProperty id;
  private final SimpleStringProperty title;
  private final SimpleStringProperty artist;
  private final SimpleStringProperty album;
  private final SimpleIntegerProperty length;
  private final SimpleIntegerProperty releaseYear;
  private final SimpleStringProperty genre;
  private final SimpleStringProperty mp3;
  private final SimpleStringProperty cover;

  public Song(int id, String title, String artist, String album, int length, int releaseYear, String genre, String mp3, String cover) {
    this.id = new SimpleIntegerProperty(id);
    this.title = new SimpleStringProperty(title);
    this.artist = new SimpleStringProperty(artist);
    this.album = new SimpleStringProperty(album);
    this.length = new SimpleIntegerProperty(length);
    this.releaseYear = new SimpleIntegerProperty(releaseYear);
    this.genre = new SimpleStringProperty(genre);
    this.mp3 = new SimpleStringProperty(mp3);
    this.cover = new SimpleStringProperty(cover);
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

  public int getLength() {
    return length.get();
  }

  public SimpleIntegerProperty lengthProperty() {
    return length;
  }

  public int getReleaseYear() {
    return releaseYear.get();
  }

  public SimpleIntegerProperty releaseYearProperty() {
    return releaseYear;
  }

  public String getGenre() {
    return genre.get();
  }

  public SimpleStringProperty genreProperty() {
    return genre;
  }

  public String getMp3() {
    return mp3.get();
  }

  public SimpleStringProperty mp3Property() {
    return mp3;
  }

  public String getCover() {
    return cover.get();
  }

  public SimpleStringProperty coverProperty() {
    return cover;
  }
}
