package com.example.berkrify.controllers;

import com.example.berkrify.models.User;
import com.example.berkrify.services.UserService;
import com.example.berkrify.testutil.JavaFXInitializer;
import javafx.collections.ObservableList;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserControllerTest {

  private UserController controller;
  private UserService userServiceMock;

  @BeforeAll
  public static void initToolkit() {
    JavaFXInitializer.initialize();
  }

  @BeforeEach
  public void setUp() throws Exception {
    controller = new UserController();
    userServiceMock = mock(UserService.class);

    setPrivateField(controller, "userService", userServiceMock);

    setPrivateField(controller, "searchField", new TextField());
    setPrivateField(controller, "idColumn", new TableColumn<User, Number>());
    setPrivateField(controller, "nameColumn", new TableColumn<User, String>());
    setPrivateField(controller, "emailColumn", new TableColumn<User, String>());
    setPrivateField(controller, "roleColumn", new TableColumn<User, String>());
    setPrivateField(controller, "createdColumn", new TableColumn<User, String>());
    setPrivateField(controller, "actionColumn", new TableColumn<User, Void>());
    setPrivateField(controller, "usersTable", new TableView<User>());
  }

  @Test
  public void testUserDataLoaded() throws Exception {
    User user = new User(1, "Admin", "admin@example.com", "admin", "pfp.png", "2024-04-01", "Admin");
    when(userServiceMock.getUsers()).thenReturn(List.of(user));

    controller.initialize();
    Thread.sleep(500);

    Field userDataField = UserController.class.getDeclaredField("userData");
    userDataField.setAccessible(true);
    ObservableList<User> users = (ObservableList<User>) userDataField.get(controller);

    assertEquals(1, users.size());
    assertEquals("Admin", users.get(0).getName());
  }

  private void setPrivateField(Object target, String fieldName, Object value) throws Exception {
    Field field = target.getClass().getDeclaredField(fieldName);
    field.setAccessible(true);
    field.set(target, value);
  }
}
