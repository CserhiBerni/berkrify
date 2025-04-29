package com.example.berkrify.services;

import com.example.berkrify.dto.UserDto;
import com.example.berkrify.models.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

  private HttpClient mockHttpClient;
  private ObjectMapper objectMapper;
  private UserService userService;

  @BeforeEach
  public void setUp() {
    mockHttpClient = mock(HttpClient.class);
    objectMapper = new ObjectMapper();
    userService = new UserService() {
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
  public void testFetchUserProfile_successful() throws Exception {
    UserDto dto = new UserDto();
    dto.setId(1);
    dto.setName("Test User");
    dto.setEmail("test@example.com");
    dto.setRole("Admin");
    dto.setCreated("2024-01-01");

    String jsonResponse = objectMapper.writeValueAsString(dto);

    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(200);
    when(mockResponse.body()).thenReturn(jsonResponse);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    UserDto result = userService.fetchUserProfile(1);

    assertNotNull(result);
    assertEquals("Test User", result.getName());
  }

  @Test
  public void testFetchUserProfile_failure_throwsException() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(404);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    assertThrows(RuntimeException.class, () -> {
      userService.fetchUserProfile(1);
    });
  }

  @Test
  public void testGetUsers_successful() throws Exception {
    UserDto dto = new UserDto();
    dto.setId(1);
    dto.setName("Admin");
    dto.setEmail("admin@example.com");
    dto.setRole("Admin");
    dto.setCreated("2024-01-01");

    String jsonResponse = objectMapper.writeValueAsString(List.of(dto));

    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(200);
    when(mockResponse.body()).thenReturn(jsonResponse);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    List<User> users = userService.getUsers();

    assertEquals(1, users.size());
    assertEquals("Admin", users.get(0).getName());
  }

  @Test
  public void testGetUsers_failure_throwsException() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(500);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    assertThrows(RuntimeException.class, () -> {
      userService.getUsers();
    });
  }

  @Test
  public void testDeleteUser_successful() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(204);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    assertDoesNotThrow(() -> {
      userService.deleteUser(1);
    });
  }

  @Test
  public void testDeleteUser_failure_throwsException() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(404);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    assertThrows(RuntimeException.class, () -> {
      userService.deleteUser(1);
    });
  }
}
