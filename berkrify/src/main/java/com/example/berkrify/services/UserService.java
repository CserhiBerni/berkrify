package com.example.berkrify.services;

import com.example.berkrify.dto.UserDto;
import com.example.berkrify.models.User;
import com.example.berkrify.util.Session;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class UserService extends BaseService {

  public UserService() {
    super(HttpClient.newHttpClient(), new ObjectMapper());
  }

  public List<User> getUsers() throws Exception {
    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
        .uri(URI.create(getBaseUrl() + "/user"))
        .header("Accept", "application/json")
        .GET();

    String token = Session.getInstance().getToken();
    if (token != null && !token.isEmpty()) {
      requestBuilder.header("Authorization", "Bearer " + token);
    }

    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = getHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() == 200) {
      List<UserDto> dtos = getObjectMapper().readValue(response.body(), new TypeReference<List<UserDto>>() {});
      List<User> users = new ArrayList<>();
      for (UserDto dto : dtos) {
        users.add(new User(dto.getId(), dto.getName(), dto.getEmail(), dto.getPassword(),
            dto.getProfilePicture(), dto.getCreated(), dto.getRole()));
      }
      return users;
    } else {
      throw new RuntimeException("Failed to fetch users, status code: " + response.statusCode());
    }
  }

}
