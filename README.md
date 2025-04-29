# 🎵 Berkrify Admin – JavaFX Application

This is the administrative desktop application for the Berkrify system, built using JavaFX. It communicates with a backend REST API to manage users and songs.

## 📁 Project Structure

- `src/` – Java source code (controllers, models, UI, tests)
- `pom.xml` – Maven configuration
- `target/` – Compiled files (generated automatically)
- `.idea/` – IntelliJ project configuration

## ⚙️ Installation & Running

### 1. Requirements

- Java 17+
- Maven 3.6+
- Internet connection for downloading dependencies
- Available REST backend (e.g. NestJS API)

### 2. Build the project

```bash
mvn clean install
```

### 3. Run the application

```bash
mvn javafx:run
```

> If `javafx:run` fails, try running the `main` method of the main application class (e.g., `BerkrifyApplication`) from your IDE.

## 🔌 REST API Connection

The application communicates with a remote REST API. You can configure the base URL in the source code or in a configuration file (e.g. `application.properties`).

Supported features:
- List users
- Manage users
- Add/delete songs
- Statistics

## 🧪 Testing

This application supports unit and integration testing with mocked REST responses.

Tests are located in:

```bash
src/test/
```

To run the tests:

```bash
mvn test
```

## 🛠 Developer Notes

- The UI is built using JavaFX and FXML
- HTTP requests are made using the `HttpClient` class
- Controllers directly interact with the backend API
