package com.example.berkrify.services;

import com.example.berkrify.dto.SongDto;
import com.example.berkrify.models.Song;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SongServiceTest {

  private HttpClient mockHttpClient;
  private ObjectMapper objectMapper;
  private SongService songService;

  @BeforeEach
  public void setUp() {
    mockHttpClient = mock(HttpClient.class);
    objectMapper = new ObjectMapper();
    songService = new SongService() {
      @Override
      protected HttpClient getHttpClient() {
        return mockHttpClient;
      }

      @Override
      protected ObjectMapper getObjectMapper() {
        return objectMapper;
      }

      @Override
      protected String getBaseUrl() {
        return "http://localhost:3000";
      }
    };
  }

  @Test
  public void testGetSongs_successful() throws Exception {
    SongDto dto = new SongDto();
    dto.setId(1);
    dto.setArtist("Test Artist");
    dto.setAlbum("Test Album");
    dto.setSong("Test Song");
    dto.setLength(180);
    dto.setReleaseYear(2022);
    dto.setGenre("Pop");
    dto.setMp3("test.mp3");
    dto.setCover("cover.jpg");
    dto.setCreatedAt("2024-01-01");

    String jsonResponse = objectMapper.writeValueAsString(List.of(dto));

    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(200);
    when(mockResponse.body()).thenReturn(jsonResponse);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockResponse);

    List<Song> songs = songService.getSongs();

    assertEquals(1, songs.size());
    assertEquals("Test Artist", songs.get(0).getArtist());
  }

  @Test
  public void testGetSongs_failure_throwsException() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(500);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockResponse);

    Exception ex = assertThrows(RuntimeException.class, () -> {
      songService.getSongs();
    });

    assertTrue(ex.getMessage().contains("HTTP GET Request Failed"));
  }

  @Test
  public void testDeleteSong_successful() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(204);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockResponse);

    assertDoesNotThrow(() -> {
      songService.deleteSong(1);
    });
  }

  @Test
  public void testDeleteSong_failure_throwsException() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(404);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockResponse);

    RuntimeException ex = assertThrows(RuntimeException.class, () -> {
      songService.deleteSong(1);
    });

    assertTrue(ex.getMessage().contains("Failed to delete"));
  }

  @Test
  public void testUpdateSong_successful() throws Exception {
    Song song = new Song(1, "Artist", "Album", "Song", 200, 2020, "Rock",
        "file.mp3", "cover.jpg", "2024-04-01");

    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(200);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockResponse);

    assertDoesNotThrow(() -> {
      songService.updateSong(song);
    });
  }

  @Test
  public void testUpdateSong_failure_throwsException() throws Exception {
    Song song = new Song(1, "Artist", "Album", "Song", 200, 2020, "Rock",
        "file.mp3", "cover.jpg", "2024-04-01");

    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(500);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(mockResponse);

    RuntimeException ex = assertThrows(RuntimeException.class, () -> {
      songService.updateSong(song);
    });

    assertTrue(ex.getMessage().contains("Failed to update"));
  }
}
