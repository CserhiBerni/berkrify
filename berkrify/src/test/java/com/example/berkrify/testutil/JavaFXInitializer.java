package com.example.berkrify.testutil;

import javafx.application.Platform;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class JavaFXInitializer {
  private static boolean initialized = false;

  public static void initialize() {
    if (initialized) return;

    CountDownLatch latch = new CountDownLatch(1);
    Platform.startup(latch::countDown);
    try {
      latch.await(5, TimeUnit.SECONDS);
      initialized = true;
    } catch (InterruptedException e) {
      throw new RuntimeException("JavaFX initialization failed", e);
    }
  }
}
