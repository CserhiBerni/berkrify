package com.example.berkrify.controllers;

import com.example.berkrify.models.Song;
import com.example.berkrify.services.SongService;
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

public class SongControllerTest {

  private SongController controller;
  private SongService songServiceMock;

  @BeforeAll
  public static void initToolkit() {
    JavaFXInitializer.initialize();
  }

  @BeforeEach
  public void setUp() throws Exception {
    controller = new SongController();
    songServiceMock = mock(SongService.class);

    setPrivateField(controller, "songService", songServiceMock);

    setPrivateField(controller, "searchField", new TextField());
    setPrivateField(controller, "idColumn", new TableColumn<Song, Number>());
    setPrivateField(controller, "artistColumn", new TableColumn<Song, String>());
    setPrivateField(controller, "albumColumn", new TableColumn<Song, String>());
    setPrivateField(controller, "titleColumn", new TableColumn<Song, String>());
    setPrivateField(controller, "lengthColumn", new TableColumn<Song, Number>());
    setPrivateField(controller, "actionColumn", new TableColumn<Song, Void>());
    setPrivateField(controller, "editColumn", new TableColumn<Song, Void>());
    setPrivateField(controller, "songsTable", new TableView<Song>());
  }

  @Test
  public void testSongDataLoaded() throws Exception {
    Song song = new Song(1, "Artist A", "Album A", "Title A", 180,
        2022, "Pop", "a.mp3", "cover.jpg", 5, "2024-04-01", "2024-04-01");
    when(songServiceMock.getSongs()).thenReturn(List.of(song));

    controller.initialize();
    Thread.sleep(500);

    Field songDataField = SongController.class.getDeclaredField("songData");
    songDataField.setAccessible(true);
    ObservableList<Song> songs = (ObservableList<Song>) songDataField.get(controller);

    assertEquals(1, songs.size());
    assertEquals("Artist A", songs.get(0).getArtist());
  }

  private void setPrivateField(Object target, String fieldName, Object value) throws Exception {
    Field field = target.getClass().getDeclaredField(fieldName);
    field.setAccessible(true);
    field.set(target, value);
  }
}
