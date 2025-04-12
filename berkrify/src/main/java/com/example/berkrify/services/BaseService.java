package com.example.berkrify.services;

import java.net.http.HttpClient;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class BaseService {
  private final static String BASE_URL = "http://localhost:3000";
  private final HttpClient httpClient;
  private final ObjectMapper objectMapper;

  protected BaseService(HttpClient httpClient, ObjectMapper objectMapper) {
    this.httpClient = httpClient;
    this.objectMapper = objectMapper;
  }

  protected HttpClient getHttpClient() {
    return httpClient;
  }

  protected ObjectMapper getObjectMapper() {
    return objectMapper;
  }

  protected String getBaseUrl() {
    return BASE_URL;
  }
}
