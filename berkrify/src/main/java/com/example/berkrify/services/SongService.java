package com.example.berkrify.services;

import com.example.berkrify.dto.SimpleSong;
import com.example.berkrify.models.Song;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class SongService {

  private final String baseUrl = "http://localhost:3000";
  private final HttpClient httpClient;
  private final ObjectMapper objectMapper;

  public SongService() {
    httpClient = HttpClient.newHttpClient();
    objectMapper = new ObjectMapper();
  }

  public List<Song> getSongs() throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + "/songs"))
        .GET()
        .build();

    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() == 200) {
      List<SimpleSong> simpleSongs = objectMapper.readValue(response.body(), new TypeReference<List<SimpleSong>>() {});
      List<Song> songs = new ArrayList<>();
      for (SimpleSong s : simpleSongs) {
        songs.add(new Song(
            s.getId(),
            s.getArtist(),
            s.getAlbum(),
            s.getSong(),
            s.getLength(),
            s.getReleaseYear(),
            s.getGenre(),
            s.getMp3(),
            s.getCover(),
            s.getPlayCount(),
            s.getLastPlayed(),
            s.getCreatedAt()
        ));
      }
      return songs;
    } else {
      throw new RuntimeException("HTTP GET Request Failed with Status code: " + response.statusCode());
    }
  }
}
