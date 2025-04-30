# Berkrify – Frontend

Ez a mappa tartalmazza a **Berkrify** alkalmazás frontend részét, amely egy **React + TypeScript** alapú webalkalmazás. Az alkalmazás zenék lejátszását, kedvencek kezelését, lejátszási listák létrehozását és profil szerkesztést biztosít.

---

## Projektindítás

### 1. Követelmények

- **Node.js**
- **npm**

### 2. Telepítés

```bash
cd .\berkrify\
npm install
```

### 3. Projekt futtatása

```bash
npm run dev
```

# Felhasználói dokumentáció – Berkrify
## Bejelentkezés és regisztráció

- A főoldalra érkezve látható a bejelentkezés/regisztráció ikon a navigációs sávban.
- Regisztráció után automatikusan bejelentkezel.
- Sikeres bejelentkezés után az alkalmazás főoldalára kerülsz.

## Főoldal

- A navigációs sávból elérhető a profilod, valamint a lejátszási listáid – létrehozási opcióval együtt.
- A keresőmező segítségével zenéket kereshetsz a főoldalon.
- Az összes zeneszám, ami az oldalon található, láthatóvá válik.
- Csúsztatással tudod végignézni a sorokat, a sor végén pedig egy visszagombbal újra az elejére ugorhatsz.

## Zenék lejátszása

- Válassz egy dalt a listából.
- A lejátszó alul megjelenik, ahol:
  - elindíthatod
  - megállíthatod
  - léptetheted
  - ismételheted a számokat
  - szabályozhatod a szám hangerejét
- A `+` ikonra kattintva a saját lejátszási listáidba adhatod a dalokat.
- A ❤️ ikonra kattintva a **Liked Songs** listába kerülnek.
- A hangerő ikonra kattintva, könnyedén elnémíthatod a számot, míg némítás után ismét hallhatóvá teheted klikkeléssel.
- A lejátszó tartalmazza a borítóképet és a dal információit.
- A borítóra kattintva nagy méretben jelenik meg zenéd fotója, kiírva információit is.
- A jobb felső sarokban lévő ikon segítségével a lejátszó összecsukható, majd újra megnyitható.
- A `+` ikonra kattintva új listába is hozzáadható a dal. Új lista létrehozásához:
  - add meg a nevét
  - leírását (opcionális)
  - a borítókép később, a **Playlists** menüpontban a lista oldalán adható hozzá, a szerkesztés funkció segítségével.

## Kedvenc dalok

- A lejátszón látható ❤️ ikonra kattintva a dalt a kedvencek közé adhatod.
- A **Liked Songs** lejátszási listában megtalálod az összes kedvelt dalodat.
- Lejátszási listákon és album oldalakon belül is lehetőséged van kedvelni őket.

## Lejátszási listák

- A **Playlists** menüpontban láthatod a saját listáidat.
- A **Create New Playlist** gomb átvisz a lejátszási lista létrehozó felületre.
- Itt:
  - megadhatsz egy nevet,
  - opcionálisan leírást és borítóképet,
  - majd a **Create Playlist** gombra kattintva létrehozhatod a listát.
- A lista elérhető a **Playlists** oldalon.
- A **Browse Songs** gomb a főoldalra visz, ahol egy zenére, valamint a lejátszón lévő `+` ikonra kattintva az adott listáidba rakhatod.
- A listák szerkeszthetőek – **kivéve a "Liked Songs" lejátszási listát**

## Dal feltöltése (Admin)

- Csak admin jogosultságú felhasználók számára elérhető.
- A **Feltöltés** oldalon lehetőség van új zenék hozzáadására:
  - MP3 fájl feltöltése
  - Borítókép feltöltése

## Profil oldal

- Megtekintheted saját profilod adatait:
  - profilkép
  - név
  - e-mail cím
  - profil létrehozásának dátuma
  - jogosultság (admin/user)
- Az **Edit Profile** gombra kattintva szerkesztheted a nevedet és profilképedet.
  - A **Save Changes** gombbal mentheted a módosításokat.
  - A **Cancel** gombbal megszakíthatod a szerkesztést.
- A **Kijelentkezés** gomb segítségével elhagyhatod a fiókodat.

