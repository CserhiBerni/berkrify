package com.example.berkrify.services;

import com.example.berkrify.dto.SongDto;
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
      List<SongDto> dtos = objectMapper.readValue(response.body(), new TypeReference<List<SongDto>>() {});
      List<Song> songs = new ArrayList<>();
      for (SongDto dto : dtos) {
        songs.add(new Song(
            dto.getId(),
            dto.getArtist(),
            dto.getAlbum(),
            dto.getSong(),
            dto.getLength(),
            dto.getReleaseYear(),
            dto.getGenre(),
            dto.getMp3(),
            dto.getCover(),
            dto.getPlayCount(),
            dto.getLastPlayed(),
            dto.getCreatedAt()
        ));
      }
      return songs;
    } else {
      throw new RuntimeException("HTTP GET Request Failed with Status code: " + response.statusCode());
    }
  }
}
