package com.example.berkrify.models;

import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;

public class Song {
  private final SimpleIntegerProperty id;
  private final SimpleStringProperty artist;
  private final SimpleStringProperty album;
  private final SimpleStringProperty song;
  private final SimpleIntegerProperty length;
  private final SimpleIntegerProperty releaseYear;
  private final SimpleStringProperty genre;
  private final SimpleStringProperty mp3;
  private final SimpleStringProperty cover;
  private final SimpleIntegerProperty playCount;
  private final SimpleStringProperty lastPlayed;
  private final SimpleStringProperty createdAt;


  public Song(int id, String artist, String album, String song, int length, int releaseYear, String genre, String mp3, String cover, int playCount, String lastPlayed, String createdAt) {
    this.id = new SimpleIntegerProperty(id);
    this.artist = new SimpleStringProperty(artist);
    this.album = new SimpleStringProperty(album);
    this.song = new SimpleStringProperty(song);
    this.length = new SimpleIntegerProperty(length);
    this.releaseYear = new SimpleIntegerProperty(releaseYear);
    this.genre = new SimpleStringProperty(genre);
    this.mp3 = new SimpleStringProperty(mp3);
    this.cover = new SimpleStringProperty(cover);
    this.playCount = new SimpleIntegerProperty(playCount);
    this.lastPlayed = new SimpleStringProperty(lastPlayed);
    this.createdAt = new SimpleStringProperty(createdAt);
  }

  public int getId() {
    return id.get();
  }

  public SimpleIntegerProperty idProperty() {
    return id;
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

  public String getSong() {
    return song.get();
  }

  public SimpleStringProperty songProperty() {
    return song;
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

  public int getPlayCount() {
    return playCount.get();
  }

  public SimpleIntegerProperty playCountProperty() {
    return playCount;
  }

  public String getLastPlayed() {
    return lastPlayed.get();
  }

  public SimpleStringProperty lastPlayedProperty() {
    return lastPlayed;
  }

  public String getCreatedAt() {
    return createdAt.get();
  }

  public SimpleStringProperty createdAtProperty() {
    return createdAt;
  }
}
