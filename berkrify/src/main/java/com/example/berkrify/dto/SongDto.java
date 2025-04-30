package com.example.berkrify.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SongDto {
  private int id;
  private String artist;
  private String album;
  private String song;
  private int length;

  @JsonProperty("release_yr")
  private int releaseYear;

  private String genre;
  private String mp3;
  private String cover;

  @JsonProperty("created_at")
  private String createdAt;

  public SongDto() {}

  public int getId() { return id; }
  public void setId(int id) { this.id = id; }

  public String getArtist() { return artist; }
  public void setArtist(String artist) { this.artist = artist; }

  public String getAlbum() { return album; }
  public void setAlbum(String album) { this.album = album; }

  public String getSong() { return song; }
  public void setSong(String song) { this.song = song; }

  public int getLength() { return length; }
  public void setLength(int length) { this.length = length; }

  public int getReleaseYear() { return releaseYear; }
  public void setReleaseYear(int releaseYear) { this.releaseYear = releaseYear; }

  public String getGenre() { return genre; }
  public void setGenre(String genre) { this.genre = genre; }

  public String getMp3() { return mp3; }
  public void setMp3(String mp3) { this.mp3 = mp3; }

  public String getCover() { return cover; }
  public void setCover(String cover) { this.cover = cover; }

  public String getCreatedAt() { return createdAt; }
  public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
