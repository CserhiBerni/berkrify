package com.example.berkrify.controllers;

import com.example.berkrify.dto.UserDto;
import com.example.berkrify.models.AuthResponse;
import com.example.berkrify.services.AuthService;
import com.example.berkrify.services.UserService;
import com.example.berkrify.testutil.JavaFXInitializer;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.mockito.Mockito.*;

public class LoginControllerTest {

  private LoginController controller;
  private AuthService mockAuthService;
  private UserService mockUserService;

  @BeforeAll
  public static void initToolkit() {
    JavaFXInitializer.initialize();
  }

  @BeforeEach
  public void setUp() throws Exception {
    controller = new LoginController();
    mockAuthService = mock(AuthService.class);
    mockUserService = mock(UserService.class);

    controller.emailField = new TextField();
    controller.passwordField = new PasswordField();
    controller.errorLabel = new Label();

    Field authField = LoginController.class.getDeclaredField("authService");
    authField.setAccessible(true);
    authField.set(controller, mockAuthService);
  }

  @Test
  public void testSuccessfulAdminLogin() throws Exception {
    controller.emailField.setText("admin@example.com");
    controller.passwordField.setText("password123");

    AuthResponse mockResponse = new AuthResponse();
    mockResponse.setToken("token123");
    mockResponse.setUserId(1);
    when(mockAuthService.login("admin@example.com", "password123")).thenReturn(mockResponse);

    UserService userServiceMock = mock(UserService.class);
    UserDto userDto = new UserDto();
    userDto.setId(1);
    userDto.setName("Admin");
    userDto.setEmail("admin@example.com");
    userDto.setRole("Admin");
    userDto.setCreated("2024-04-01");
    when(userServiceMock.fetchUserProfile(1)).thenReturn(userDto);


    controller.handleLogin(null);

    Thread.sleep(1000);

    verify(mockAuthService).login("admin@example.com", "password123");
  }

  @Test
  public void testLoginFailureInvalidCredentials() throws Exception {
    controller.emailField.setText("user@example.com");
    controller.passwordField.setText("wrongpass");

    when(mockAuthService.login("user@example.com", "wrongpass")).thenReturn(null);

    controller.handleLogin(null);
    Thread.sleep(1000);

    verify(mockAuthService).login("user@example.com", "wrongpass");

  }
}
