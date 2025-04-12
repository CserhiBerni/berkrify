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

public class SongService extends BaseService {

  public SongService() {
    super(HttpClient.newHttpClient(), new ObjectMapper());
  }

  public List<Song> getSongs() throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(getBaseUrl() + "/songs"))
        .GET()
        .build();

    HttpResponse<String> response = getHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() == 200) {
      List<SongDto> dtos = getObjectMapper().readValue(response.body(), new TypeReference<List<SongDto>>() {});
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

  public void deleteUser(int id) throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(getBaseUrl() + "/songs/" + id))
        .DELETE()
        .build();

    HttpResponse<String> response = getHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() != 200 && response.statusCode() != 204) {
      throw new RuntimeException("Failed to delete song, status code: " + response.statusCode());
    }
  }
}
