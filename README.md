# Felhasználói dokumentáció – Berkrify Admin

Ez az alkalmazás a Berkrify rendszer adminisztrációs felülete, amely lehetővé teszi a felhasználók és zenék kezelését, statisztikák kivonását admin jogosultságú felhasználók számára. A felület asztali alkalmazásként működik JavaFX alapokon.

---

### Áttekintés

A Berkrify Admin célja, hogy az adminisztrátorok egyszerűen tudják kezelni a rendszerben található:

- Felhasználókat
- Feltöltött zenéket

Az alkalmazás egy háttérrendszerhez (REST API) kapcsolódik, amelyen keresztül az adatok frissülnek, direkt adatbázis kapcsolatot így nem létesít a program.

---

### Indítás

#### 1. Követelmények

- Java 17 vagy újabb
- Az admin alkalmazás `.jar` vagy `.exe` formában
- Stabil internetkapcsolat
- Elérhető Berkrify backend rendszer

#### 2. Indítás módja

Ha a programot forrásból indítod:

```bash
mvn javafx:run
```

Ha egy lefordított `.jar` fájlod van:

```bash
java -jar berkrify-admin.jar
```

---

### Használat

#### Fő funkciók:

- **Felhasználók listázása** – megjeleníti a rendszerben regisztrált felhasználókat
- **Felhasználók törlése** - adminisztrátorok eltávolíthatnak felhasználókat, értelem szerűen saját magukat futás közben nem
- **Felhasználók regisztrálása** - új felhasználók felvétele, név, email, jelszó megadása, illetve szerepkör választása után
- **Felhasználók keresése** - név alapján lehet keresni, illetve lehet a táblázatban minden tulajdonság alapján rendezni
- **Export felhasználókból** - az összes felhasználói adatot lehet exportálni csv fájlba
- **Felhasználói statisztika** - egy egyszerű kördiagrammos kimutatás a normál "user"-ek és "admin"-ok eloszlásáról
- **Zenék listázása** – megjeleníti a rendszerben lévő zenéket
- **Zenék törlése** - lehetőség van zeneszámok törlésére a rendszerből
- **Zenék módosítása** - egy adott zene adatainak bármely tagját lehet módosítani manuálisan
- **Zenék keresése** - cím alapján lehet keresni, illetve lehet a táblázatban minden tulajdonság alapján rendezni
- **Export zenékből** - az összes zene adatot lehet exportálni csv fájlba
- **Zenei statisztika** - egy egyszerű oszlopdiagrammos kimutatás a meglévő műfajok alapján
- **Fájl feltöltés** - lehetőség van mp3 fájlok és borító képek feltöltésére is, zenékhez

#### Általános lépések:

1. **Indítsd el az alkalmazást**
2. **Győződj meg róla, hogy a szükséges adatbázis és backend futnak**
3. **Várd meg, míg betöltődik az adat**
4. **Válassz egy menüpontot a főképernyőn**
5. **Végezd el a kívánt műveletet (pl. új zene feltöltése)**

---

### Gyakori problémák

| Probléma | Megoldás |
|----------|----------|
| Az alkalmazás nem indul el | Ellenőrizd, hogy telepítve van-e a Java 17 |
| Nem tölt be az adat | Győződj meg róla, hogy a backend fut és elérhető |
| Nem tudok feltölteni zenét | Ellenőrizd az internetkapcsolatot, illetve a REST API válaszokat |


# Fejlesztői dokumentáció – Berkrify Admin

Ez a dokumentáció segít a Berkrify Admin alkalmazás fejlesztésében, karbantartásában és továbbfejlesztésében.

---

### Áttekintés

A **Berkrify Admin** egy JavaFX alapú asztali alkalmazás, amely egy háttérrendszerhez (REST API) csatlakozik, hogy admin funkciókat biztosítson a Berkrify zenelejátszó rendszerhez.

Az alkalmazás egy **MVC + Service** architektúrát követ:

- **Model** osztályok: az adatbázisban lévő entitásokat (pl. felhasználók, lejátszási listák, zenék) reprezentálják Java objektumok formájában.
- **View** réteg: FXML fájlokból áll, ezek határozzák meg az egyes képernyők megjelenését és elrendezését.
- **Controller** osztályok: ezek kezelik a felhasználói interakciókat, eseményeket és a megjelenítés mögötti üzleti logikát.
- **Service** réteg: felelős a REST API-val való kommunikációért, és hidat képez a vezérlők és a háttérrendszer között.

Ez a struktúra jól szétválasztja az alkalmazás felelősségi köreit, karbantarthatóvá és jól bővíthetővé téve a projektet.


---

### Technológiai stack

- **Java 17+**
- **JavaFX** – GUI fejlesztéshez
- **FXML** – felhasználói felületek deklarálása
- **HttpClient** – REST API kommunikáció
- **Maven** – build és függőségkezelés
- **JUnit** – tesztelés

---

### Projekt struktúra

- `src/main/java` – fő Java forráskód
  - `controller` – FXML-hez kapcsolódó vezérlőosztályok
  - `model` – adatok modellezése (pl. User, Playlist)
  - `service` – REST kommunikáció
- `src/main/resources` – FXML fájlok és statikus erőforrások
- `src/test/java` – tesztosztályok
- `pom.xml` – Maven konfiguráció

---

### Telepítés

A projekt futtatásához Java 17+ és Maven szükséges. A lépések a következők:

1. Klónozd vagy töltsd le a projektet
2. Nyisd meg IDE-ben vagy terminálban
3. Telepítsd a függőségeket:
   ```bash
   mvn install
   ```
4. Indítsd a JavaFX alkalmazást (pl. Main osztályból)

Backend elérhetősége: `http://localhost:3000` (ezt a `BaseService` használja REST hívásokhoz)

Az applikáció windowsra való telepítéséhez vagy a legfrissebb exe fájl indítása szolgál, vagy az msi fájl indítása a gyökérkönyvtárban
---

### REST API kommunikáció

Az alkalmazás `HttpClient` segítségével küld HTTP kéréseket a backendhez. A hívások JSON válaszokat várnak, amelyeket Java objektumokká alakít.

Példa lekérdezés:

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("http://localhost:3000/users"))
    .GET()
    .build();
```


# Tesztelési dokumentáció – Berkrify JavaFX alkalmazás

## Tesztelt komponensek
- JavaFX kontrollerek (Controller osztályok)
- Szolgáltatásréteg (Service osztályok REST kommunikációval)

---

## 1. Kontrollerek tesztelése

### ✅ SongControllerTest
- Teszteli, hogy a dalok a `SongService.getSongs()` mockolt válasza alapján helyesen betöltődnek
- A `songData` ObservableList frissülése ellenőrzött
- A `songService`, `songsTable` és többi @FXML mező reflection segítségével került beállításra
- JavaFX platform inicializálás `JavaFXInitializer.initialize()` segítségével

### ✅ UserControllerTest
- Teszteli, hogy a `UserService.getUsers()` által visszaadott felhasználók betöltődnek
- A `userData` ObservableList állapotát ellenőrizzük
- A `searchField` mező manuálisan beállítva, mivel @FXML

### ✅ LoginControllerTest
- Teszteli, hogy az `AuthService.login()` sikeres válasz esetén betölti a dashboardot
- Sikertelen login esetén `AlertWindow.showAlert()` hívódik meg
- A `emailField`, `passwordField`, `errorLabel` mezők kézzel beállítva

---

## 2. Service osztályok tesztelése

### ✅ AuthServiceTest
- `login()` sikeres válasz: token és userId frissül a Session-ben
- `login()` hibás válasz: kivételt dob
- `register()` sikeres és sikertelen hívás tesztelve
- Minden HTTP kommunikáció mockolt HttpClient segítségével történt

### ✅ SongServiceTest
- `getSongs()` DTO-ból modell konverzió tesztelve
- `deleteSong(id)` és `updateSong(song)` metódusok helyes státuszkódok alapján értékelve

### ✅ UserServiceTest
- `fetchUserProfile(id)` sikeres és hibás válasz kezelése
- `getUsers()` DTO-k listájából JavaFX `User` példányok készülnek
- `deleteUser(id)` sikeres és hibás válasz alapján ellenőrizve

---

## Tesztelési technikák

- **JUnit 5**: fő tesztkeretrendszer
- **Mockito**: `HttpClient`, `HttpResponse`, és Service osztályok mockolásához
- **Reflection API**: privát mezők (pl. FXML-ek) injektálása a controller tesztekhez
- **JavaFX Platform.startup()**: egyszeri inicializálás minden JavaFX-teszt előtt
- **ObjectMapper**: JSON ↔ DTO konverziók teszteléséhez

---

## Tesztlefedettség

| Komponens         | Metódusok                     | Tesztelve | Megjegyzés                         |
|-------------------|-------------------------------|-----------|-----------------------------------|
| SongController     | initialize(), loadSongs       | ✅         | GUI + adat betöltés              |
| UserController     | initialize(), loadUsers       | ✅         | GUI + keresőmező + adatlista     |
| LoginController    | handleLogin()                 | ✅         | Sikeres + hibás login            |
| AuthService        | login(), register()           | ✅         | Session + JSON kezelés           |
| SongService        | getSongs(), update, delete    | ✅         | DTO-konverzió + státuszkódok     |
| UserService        | profile, list, delete         | ✅         | Tokenes lekérés + konverzió      |

---

## Összefoglalás

A tesztek átfogóan lefedik a Berkrify JavaFX admin alkalmazás fő komponenseit. A controller osztályok megfelelően lettek izolálva és unit tesztelve reflection segítségével, míg a Service rétegben minden HTTP kommunikáció mock környezetben lett validálva. A tesztek biztosítják, hogy az alkalmazás helyesen reagál mind pozitív, mind negatív REST válaszokra, miközben a GUI réteg működését is szimulálják JavaFX környezetben. A projekt megfelel egy jól struktúrált, Layered MVC architektúrának.
