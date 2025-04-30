## Felhasználói dokumentáció – Berkrify Admin

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


## Fejlesztői dokumentáció – Berkrify Admin

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

### Fejlesztési környezet beállítása

#### 1. Függőségek telepítése

A projekt Maven alapú, így elegendő:

```bash
mvn clean install
```

#### 2. Futtatás IDE-ből

- Nyisd meg a projektet IntelliJ IDEA-ban
- Jobb klikk a `main` metódust tartalmazó osztályon (pl. `Main.java`)
- Futtatás (Run)

#### 3. REST API URL

A REST API címe jelenleg be van égetve a kódban, a `BaseService` osztályban

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
