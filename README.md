# Berkrify – Backend
 
Ez a mappa tartalmazza a **Berkrify** alkalmazás backendjét, amely egy **NestJS** alapú REST API. Az alkalmazás zenék kezelésére, lejátszási listák létrehozására és kedvencek mentésére alkalmas. Az adatbázis réteg **Prisma ORM** segítségével van implementálva, a háttérben **MariaDB**-t használva.
 
---
 
## Projektindítás – Lépésről lépésre
 
### 1. Követelmények
 
- **Node.js**
- **npm**
- **MariaDB**
  - **Port:** `3306`
  - **Felhasználó:** `root`
  - **Jelszó:** *(nincs)*
 
### 2. Telepítés
 
```bash
cd berkrify-backend
npm install
```
### 3. .env fájl létrehozása
 
```bash
DATABASE_URL="mysql://root@localhost:3306/songs"
```
```bash
npx prisma generate
```
 
### 4. Backend indítása debug módban
 
```bash
npm run start:debug
```
 
### Prisma inicializálása / Seedelés (SZÜKSÉG ESETÉN)
 
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db push
npx prisma db seed
```
## Projektfájlok részletesen
 
```
berkrify-backend/
├── src/
│   ├── auth/               # Bejelentkezés, regisztráció, tokenkezelés
│   ├── favorites/          # Kedvenc zenék („Liked Songs”) kezelése
│   ├── playlists/          # Lejátszási listák CRUD, dalhozzáadás/törlés
│   ├── songs/              # Zenék feltöltése, lekérdezése, frissítése
│   ├── user/               # Felhasználói adatok lekérése, szerkesztése
│   ├── prisma.service.ts   # Prisma kliens regisztrálása
│   └── main.ts             # Alkalmazás belépési pontja
│
├── prisma/
│   ├── schema.prisma       # Adatbázismodell (Prisma ORM)
│   └── seed.ts             # Tesztadatok beszúrása
│
├── uploads/                # Feltöltött fájlok (MP3, borítóképek)
├── .env                    # Környezeti változók (pl. DATABASE_URL)
├── package.json            # Projektfüggőségek és parancsok
├── tsconfig.json           # TypeScript konfiguráció
```
 | Modul                         | Teszt típus | Teszt állapot |
|------------------------------|-------------|----------------|
| AuthController / AuthService | Unit & E2E  | ✅ Sikeres     |
| AppController                | Unit        | ✅ Sikeres     |
| GenreController / GenreService | Unit     | ✅ Sikeres     |
| SongsController / SongsService | Unit & E2E | ✅ Sikeres     |
| PlaylistService              | Unit        | ✅ Sikeres     |
| UserService                  | Unit        | ✅ Sikeres     |
| UserController               | E2E         | ❌ Sikertelen (404 hibák) |
| FavoritesController          | E2E         | ❌ Sikertelen (401 hiba) |
| PlaylistController           | E2E         | ❌ Sikertelen (401 hiba) |


### Összegzés
- A projekt legtöbb modulját sikerült lefedni automatikus tesztekkel. A sikertelen végpont-tesztek ellenére az alapfunkciók stabilan működnek, és a kód jól strukturált módon tesztelhető.
