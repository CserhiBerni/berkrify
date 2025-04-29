package com.example.berkrify.services;

import com.example.berkrify.models.AuthResponse;
import com.example.berkrify.util.Session;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

  private HttpClient mockHttpClient;
  private ObjectMapper objectMapper;
  private AuthService authService;

  @BeforeEach
  public void setUp() {
    mockHttpClient = mock(HttpClient.class);
    objectMapper = new ObjectMapper();
    authService = new AuthService() {
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
  public void testLogin_successful() throws Exception {
    String email = "admin@example.com";
    String password = "password123";
    String jsonResponse = "{\"token\":\"abc123\", \"userId\":42}";

    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(200);
    when(mockResponse.body()).thenReturn(jsonResponse);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    AuthResponse result = authService.login(email, password);

    assertNotNull(result);
    assertEquals("abc123", result.getToken());
    assertEquals(42, result.getUserId());
    assertEquals("abc123", Session.getInstance().getToken());
    assertEquals(42, Session.getInstance().getCurrentUserId());
  }

  @Test
  public void testLogin_failure_throwsException() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(401);
    when(mockResponse.body()).thenReturn("Unauthorized");
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    Exception exception = assertThrows(Exception.class, () -> {
      authService.login("baduser", "wrongpass");
    });

    assertTrue(exception.getMessage().contains("Login failed"));
  }

  @Test
  public void testRegister_successful() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(201);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    assertDoesNotThrow(() -> {
      authService.register("John Doe", "john@example.com", "securepass", "Admin");
    });
  }

  @Test
  public void testRegister_failure_throwsException() throws Exception {
    HttpResponse<String> mockResponse = mock(HttpResponse.class);
    when(mockResponse.statusCode()).thenReturn(500);
    when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(mockResponse);

    RuntimeException ex = assertThrows(RuntimeException.class, () -> {
      authService.register("Jane", "jane@example.com", "pass", "User");
    });

    assertTrue(ex.getMessage().contains("Registration failed"));
  }
}
