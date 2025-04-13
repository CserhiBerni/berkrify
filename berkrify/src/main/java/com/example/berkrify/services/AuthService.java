package com.example.berkrify.services;

import com.example.berkrify.dto.CreateUserDto;
import com.example.berkrify.models.AuthResponse;
import com.example.berkrify.util.Session;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class AuthService extends BaseService {

  public AuthService() {
    super(HttpClient.newHttpClient(), new ObjectMapper());
  }

  public AuthResponse login(String email, String password) throws Exception {
    String requestBody = String.format("{\"email\": \"%s\", \"password\": \"%s\"}", email, password);
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(getBaseUrl() + "/user/login"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
        .build();

    HttpResponse<String> response = getHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() == 200 || response.statusCode() == 201) {
      AuthResponse authResponse = getObjectMapper().readValue(response.body(), AuthResponse.class);
      Session.getInstance().setToken(authResponse.getToken());
      Session.getInstance().setCurrentUserId(authResponse.getUserId());
      return authResponse;
    } else {
      throw new Exception("Login failed with status code: " + response.statusCode());
    }
  }

  public void register(String name, String email, String password, String role) throws Exception {
    CreateUserDto dto = new CreateUserDto();
    dto.setName(name);
    dto.setEmail(email);
    dto.setPassword(password);
    dto.setRole(role);

    String jsonData = getObjectMapper().writeValueAsString(dto);

    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(getBaseUrl() + "/user"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(jsonData, StandardCharsets.UTF_8))
        .build();

    HttpResponse<String> response = getHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() == 200 || response.statusCode() == 201) {
      return;
    } else {
      throw new RuntimeException("Registration failed with status code: " + response.statusCode());
    }
  }
}
