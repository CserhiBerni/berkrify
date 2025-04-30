-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 30. 14:54
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `songs`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `playlist`
--

CREATE TABLE `playlist` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `coverImagePath` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `playlist`
--

INSERT INTO `playlist` (`id`, `name`, `description`, `coverImagePath`, `created_at`, `updated_at`, `user_id`) VALUES
(1, 'Liked Songs', 'Songs you\'ve liked', NULL, '2025-04-30 10:54:46.577', '2025-04-30 10:54:46.577', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `playlistsong`
--

CREATE TABLE `playlistsong` (
  `id` int(11) NOT NULL,
  `playlist_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL,
  `added_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `songs`
--

CREATE TABLE `songs` (
  `id` int(11) NOT NULL,
  `artist` varchar(191) NOT NULL,
  `album` varchar(191) NOT NULL,
  `song` varchar(191) NOT NULL,
  `length` int(11) NOT NULL,
  `release_yr` int(11) NOT NULL,
  `genre` varchar(191) NOT NULL,
  `mp3` varchar(191) NOT NULL,
  `cover` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `songs`
--

INSERT INTO `songs` (`id`, `artist`, `album`, `song`, `length`, `release_yr`, `genre`, `mp3`, `cover`, `created_at`) VALUES
(1, 'Kendrick Lamar, Blxst, Amanda Reifer', 'Mr.Morale & The Big Steppers', 'Die Hard', 239, 2022, 'Hip-Hop, R&B', 'http://localhost:3000/uploads/mp3/1746010805404-812686978.mp3', 'http://localhost:3000/uploads/covers/1746010805489-483544154.jpg', '2025-04-30 10:54:02.922'),
(2, 'C418', 'Minecraft - Volume Alpha', 'Moog City', 220, 2011, 'Ambient, 8-bit', 'http://localhost:3000/uploads/mp3/1746013287121-626631223.mp3', 'http://localhost:3000/uploads/covers/1746013287167-400663184.jpg', '2025-04-30 10:54:02.952'),
(3, 'Kris$ Bos$, DOMinic\r\n', 'Telepi Vér', 'Telepi Vér', 149, 2015, 'Rap', 'http://localhost:3000/uploads/mp3/1746014335476-503019947.mp3', 'http://localhost:3000/uploads/covers/1746014335516-714696441.png', '2025-04-30 10:54:03.002'),
(4, 'Shakira, Wyclef Jean', 'Oral Fixation, Vol.2', 'Hips Don\'t Lie (feat. Wyclef Jean)', 218, 2005, 'Pop', 'http://localhost:3000/uploads/mp3/1746015962386-717836446.mp3', 'http://localhost:3000/uploads/covers/1746015962465-697455975.jpg', '2025-04-30 10:54:03.019'),
(5, 'Tyler, The Creator', 'CHROMAKOPIA', 'Tomorrow', 182, 2024, 'Neo Soul, Alternative hip-hop', 'http://localhost:3000/uploads/mp3/1746011153279-638062720.mp3', 'http://localhost:3000/uploads/covers/1746011153352-116547438.jpg', '2025-04-30 10:54:03.035'),
(6, '$uicideboy$', 'I Want to Die In New Orleans', 'Meet Mr. NICEGUY', 146, 2018, 'Dark Trap', 'http://localhost:3000/uploads/mp3/1746013459335-961829804.mp3', 'http://localhost:3000/uploads/covers/1746013459398-628118418.jpg', '2025-04-30 10:54:03.052'),
(7, 'Figura', 'Ismersz', 'Capri Sun', 187, 2023, 'Trap', 'http://localhost:3000/uploads/mp3/1746014525479-374474336.mp3', 'http://localhost:3000/uploads/covers/1746014525551-83635805.jpg', '2025-04-30 10:54:03.069'),
(8, 'Justin Bieber, Nicki Minaj', 'Believe (Deluxe Edition)', 'Beauty And A Beat', 227, 2012, 'Pop', 'http://localhost:3000/uploads/mp3/1746015473592-784118053.mp3', 'http://localhost:3000/uploads/covers/1746015473658-443850375.jpg', '2025-04-30 10:54:03.086'),
(9, 'Martina Stoessel, Jorge Blanco', 'Violetta - Cantar es lo que soy', 'Podemos', 202, 2013, 'Pop', 'http://localhost:3000/uploads/mp3/1746012091562-34586437.mp3', 'http://localhost:3000/uploads/covers/1746012091624-514373372.jpg', '2025-04-30 10:54:03.102'),
(10, 'Kanye West', 'Donda', 'Come to Life', 310, 2021, 'Pop, R&B', 'http://localhost:3000/uploads/mp3/1746012612682-896191268.mp3', 'http://localhost:3000/uploads/covers/1746012612764-985573902.jpg', '2025-04-30 10:54:03.119'),
(11, 'Hundred Sins, gyuris, Szalai, Filo, ibbigang', 'OPERA', 'Tisza', 192, 2022, 'Trap', 'http://localhost:3000/uploads/mp3/1746014788871-525948858.mp3', 'http://localhost:3000/uploads/covers/1746014788928-551091924.jpg', '2025-04-30 10:54:03.135'),
(12, 'Mac Miller', 'Circles', 'Hand Me Downs', 298, 2020, 'Hip-hop, Rap', 'http://localhost:3000/uploads/mp3/1746015727099-551530266.mp3', 'http://localhost:3000/uploads/covers/1746015727181-925142534.jpg', '2025-04-30 10:54:03.152'),
(13, 'Kanye West', '808s & Heartbreak', 'Street Lights', 208, 2008, 'R&B, Alternative hip-hop', 'http://localhost:3000/uploads/mp3/1746012405225-871142907.mp3', 'http://localhost:3000/uploads/covers/1746012405292-29491374.jpg', '2025-04-30 10:54:03.169'),
(14, 'SP', 'Kölyök 22', 'A Nevem Sp', 224, 2010, 'Pop', 'http://localhost:3000/uploads/mp3/1746013632174-319709900.mp3', 'http://localhost:3000/uploads/covers/1746013632235-257338845.jpg', '2025-04-30 10:54:03.186'),
(15, 'YoungBoy Never Broke Again', 'The Last Slimeto', 'Holy', 118, 2022, 'Rap', 'http://localhost:3000/uploads/mp3/1746014967005-39683104.mp3', 'http://localhost:3000/uploads/covers/1746014967047-249146071.jpg', '2025-04-30 10:54:03.202'),
(16, 'YoungBoy Never Broke Again', 'Decided 2', 'Came A Long Way', 163, 2023, 'Rap', 'http://localhost:3000/uploads/mp3/1746015839897-982163740.mp3', 'http://localhost:3000/uploads/covers/1746015839947-757077436.jpg', '2025-04-30 10:54:03.219'),
(17, 'Homixide Gang', 'Homixide Lifestyle', 'Lifestyle', 137, 2022, 'Trap', 'http://localhost:3000/uploads/mp3/1746012862829-598023117.mp3', 'http://localhost:3000/uploads/covers/1746012862877-915356583.jpg', '2025-04-30 10:54:03.235'),
(18, 'SP', 'Special', 'Ne Add Fel!', 197, 2009, 'Pop', 'http://localhost:3000/uploads/mp3/1746013779831-934149146.mp3', 'http://localhost:3000/uploads/covers/1746013779886-355921860.jpg', '2025-04-30 10:54:03.252'),
(19, 'ibbigang, Valter, Szalai', 'Célkereszt', 'Célkereszt', 153, 2025, 'Trap', 'http://localhost:3000/uploads/mp3/1746015166842-554058518.mp3', 'http://localhost:3000/uploads/covers/1746015166890-952652366.jpg', '2025-04-30 10:54:03.269'),
(20, 'Manuel', 'Tiara', 'Tiara', 203, 2024, 'Hip-hop, R&B', 'http://localhost:3000/uploads/mp3/1746016088755-513280454.mp3', 'http://localhost:3000/uploads/covers/1746016088842-108071585.jpg', '2025-04-30 10:54:03.286'),
(21, '$uicideboy$', 'I No Longer Fear the Razor Guarding My Heel', 'My Flaws Burn Through My Skin Like Demonic Flames from Hell', 167, 2015, 'Dark Trap', 'http://localhost:3000/uploads/mp3/1746013025836-702724427.mp3', 'http://localhost:3000/uploads/covers/1746013025892-636685846.jpg', '2025-04-30 10:54:03.302'),
(22, 'Sean Kingston, Justin Bieber', 'Eenie Meenie', 'Eenie Meenie', 201, 2010, 'Pop', 'http://localhost:3000/uploads/mp3/1746013987236-47147002.mp3', 'http://localhost:3000/uploads/covers/1746013987311-586744279.jpg', '2025-04-30 10:54:03.319'),
(23, 'Tyler, The Creator, Lola Young', 'CHROMAKOPIA', 'Like Him (feat. Lola Young)', 278, 2024, 'Alternative hip-hop', 'http://localhost:3000/uploads/mp3/1746015334142-279102471.mp3', 'http://localhost:3000/uploads/covers/1746015334231-468737693.jpg', '2025-04-30 10:54:03.335'),
(24, 'Denzel Curry, That Mexican OT', 'King Of The Mischievous South Vol. 2', 'BLACK FLAG FREESTYLE (with That Mexican OT)', 217, 2024, 'Rap', 'http://localhost:3000/uploads/mp3/1746016665637-397108584.mp3', 'http://localhost:3000/uploads/covers/1746016665704-859773995.jpg', '2025-04-30 10:54:03.352'),
(25, 'Kri$$ Bo$$', 'Boldog $zületésnapot', 'Boldog $zületésnapot', 177, 2012, 'Rap', 'http://localhost:3000/uploads/mp3/1746014176938-846571000.mp3', 'http://localhost:3000/uploads/covers/1746014176997-492743396.png', '2025-04-30 10:54:03.369'),
(26, 'Manuel', 'Orgonabokor', 'Mindenen Túl', 141, 2025, 'Trap', 'http://localhost:3000/uploads/mp3/1746016431435-901068992.mp3', 'http://localhost:3000/uploads/covers/1746016431514-742103096.jpg', '2025-04-30 10:54:03.385'),
(27, 'Manuel', 'Zombi', 'Zombi', 191, 2022, 'Trap', 'http://localhost:3000/uploads/mp3/1746016339454-776648684.mp3', 'http://localhost:3000/uploads/covers/1746016339531-678493552.jpg', '2025-04-30 10:54:03.402'),
(28, 'Mr. Rickey Upton', '5-Star', 'Hanging by a Moment', 366, 1997, 'Disney', 'https://wide-scratch.com/', 'https://picsum.photos/seed/36RW1Z/628/1778?blur=10', '2025-04-30 10:54:03.419'),
(29, 'Kevin Boyer', 'How To: Friend, Love, Freefall', 'Have You Ever Really Loved a Woman?', 60, 1999, 'Punk Rock', 'https://limping-hyphenation.net/', 'https://picsum.photos/seed/to79u/3986/2037?blur=5', '2025-04-30 10:54:03.435'),
(30, 'Tyler, The Creator, Teezo Touchdown', 'CHROMAKOPIA', 'Darling, I', 254, 2024, 'R&B, Alternative hip-hop', 'http://localhost:3000/uploads/mp3/1746011258385-30887929.mp3', 'http://localhost:3000/uploads/covers/1746011258477-123589399.jpg', '2025-04-30 10:54:03.452'),
(31, 'Tracey Sipes PhD', 'For Emma, Forever Ago', 'Two Hearts', 154, 2011, 'Rockabilly', 'https://ashamed-hunger.com/', 'https://picsum.photos/seed/rbtw3k/3033/260?blur=2', '2025-04-30 10:54:03.469'),
(32, 'Miguel Franey', 'Robin Hood: Prince Of Thieves', 'Bad Romance', 290, 2014, 'Barbershop', 'https://yellow-granny.biz', 'https://picsum.photos/seed/8yrfCNLIZ9/2964/3991?blur=2', '2025-04-30 10:54:03.486'),
(33, 'Heather Schuster I', 'Where The Light Is', 'Help!', 228, 2008, 'Folk-Rock', 'https://similar-birdbath.org/', 'https://picsum.photos/seed/v57g3QxZ/2181/1594?blur=6', '2025-04-30 10:54:03.502'),
(34, 'Jasmine Davis', 'Bleach', 'Brand New Key', 176, 1993, 'CCM', 'https://ripe-accountability.info', 'https://picsum.photos/seed/kciA1TCdvs/2677/2515?blur=9', '2025-04-30 10:54:03.519'),
(35, 'Caleb Nienow', 'Equals (=)', 'Your Cheatin\' Heart', 351, 2002, 'Local', 'https://monthly-wedding.org/', 'https://picsum.photos/seed/Qlaz7/603/3760?grayscale&blur=3', '2025-04-30 10:54:03.544'),
(36, 'Gerald Bergstrom', 'Moosetape', 'All My Lovin\' (You\'re Never Gonna Get It)', 100, 1984, 'Zydeco', 'https://strange-instance.net', 'https://picsum.photos/seed/4gJ7ahI/3369/2226?grayscale&blur=6', '2025-04-30 10:54:03.560'),
(37, 'Dr. Bob Kreiger', 'In A Perfect World...', 'Cherry Pink & Apple Blossom White', 92, 2021, 'Halloween', 'https://appropriate-flat.net', 'https://picsum.photos/seed/TD2rJXR/2250/298?blur=8', '2025-04-30 10:54:03.577'),
(38, 'Hilda Skiles', 'Sucker', 'Gold Digger', 94, 1982, 'Mandopop', 'https://creamy-coin.net', 'https://picsum.photos/seed/eJvTgr/308/1038?blur=9', '2025-04-30 10:54:03.593'),
(39, 'Jackie Brown', 'The Way It Is', 'This Love', 372, 1983, 'No Wave', 'https://somber-middle.org', 'https://picsum.photos/seed/4sPgBKt/3809/3544?blur=4', '2025-04-30 10:54:03.610'),
(40, 'Karen Kutch', 'Black Star Elephant', 'What Goes Around Comes Around', 293, 2006, 'Retro', 'https://noted-piglet.net/', 'https://picsum.photos/seed/pxihqrG/3701/2891?grayscale&blur=7', '2025-04-30 10:54:03.627'),
(41, 'Terence Morar', 'Mellon Collie And The Infinite Sadness', 'Fallin\'', 229, 2019, 'Hardcore Punk', 'https://jaunty-release.biz/', 'https://picsum.photos/seed/WwEvUz62kZ/3907/165?blur=1', '2025-04-30 10:54:03.644'),
(42, 'Dr. Fred Ernser', 'Endless Summer Vacation', 'This Land is Your Land', 200, 2010, 'Club', 'https://radiant-unit.net/', 'https://picsum.photos/seed/4xlcE/525/2406?blur=3', '2025-04-30 10:54:03.660'),
(43, 'Gilbert Stark', 'Delta', 'The First Time Ever I Saw Your Face', 68, 2023, 'Early Music', 'https://joyful-provider.name', 'https://picsum.photos/seed/FcScrxl/3912/1715?grayscale&blur=10', '2025-04-30 10:54:03.677'),
(44, 'Jean Bashirian', 'Sounds Of Silence', 'Cheek to Cheek', 256, 2022, 'MPB', 'https://lone-diver.biz/', 'https://picsum.photos/seed/tvjnIXDCDW/3633/1736?grayscale&blur=7', '2025-04-30 10:54:03.693'),
(45, 'Rudy Rath', 'Mr. Davis', 'Cry Like a Baby', 324, 1994, 'Chill', 'https://anguished-baritone.biz', 'https://picsum.photos/seed/m8gKcCJq/411/1247?blur=9', '2025-04-30 10:54:03.710'),
(46, 'Kevin Terry', 'Ill Communication', 'Sleep Walk', 274, 1996, 'Mainstream Jazz', 'https://pale-finding.net', 'https://picsum.photos/seed/I8jWAGHWo/1354/1561?blur=8', '2025-04-30 10:54:03.727'),
(47, 'Ruben Fay', 'Straight Outta Compton', 'Leader of the Pack', 361, 2022, 'New Wave', 'https://prime-maestro.name/', 'https://picsum.photos/seed/Lt8mfE1/2999/3727?blur=3', '2025-04-30 10:54:03.744'),
(48, 'Angelica Christiansen', 'Bloom', 'Crazy in Love', 220, 1998, 'Krautrock', 'https://mammoth-finer.net', 'https://picsum.photos/seed/ohWFzAvW/3730/2822?blur=6', '2025-04-30 10:54:03.777'),
(49, 'Walter Predovic', 'Sad Boyz 4 Life II', 'Tossing & Turning', 194, 1980, 'Death Metal', 'https://honored-status.net', 'https://picsum.photos/seed/2JnQLQ8h/2147/3437?blur=4', '2025-04-30 10:54:03.827'),
(50, 'Olga Dicki DDS', 'Love Stuff', 'Big Girls Don\'t Cry', 125, 1992, 'Groove', 'https://rusty-marten.net/', 'https://picsum.photos/seed/YuFTBA9K/3633/1424?blur=10', '2025-04-30 10:54:04.019');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `token`
--

CREATE TABLE `token` (
  `token` varchar(191) NOT NULL,
  `userId` int(11) NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `token`
--

INSERT INTO `token` (`token`, `userId`, `expires`) VALUES
('692307fd3fad79fc6b48a52cf0536ea424089c4c405e4cbef41dc9d73ca678b7', 1, '2025-05-07 10:54:46.424');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `profilePicture` varchar(191) DEFAULT NULL,
  `created` datetime(3) NOT NULL,
  `role` enum('Admin','User') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `profilePicture`, `created`, `role`) VALUES
(1, 'Admin', 'admin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$7uciU+Yb8wS4raVuRf8ysA$ntYzsSMgUBa/3X9yh6lMAVujrKvm1OkGzxZ3aT7B4so', NULL, '2025-04-30 10:54:02.786', 'Admin'),
(2, 'User', 'user@example.com', '$argon2id$v=19$m=65536,t=3,p=4$TahiPM9TTLry0jngj6dIBg$VD4HBROpVvn3IW4OCu07ukkA44AFlzn7nV0h8Y9ywhw', NULL, '2025-04-30 10:54:02.860', 'User');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `favorites_user_id_fkey` (`user_id`),
  ADD KEY `favorites_song_id_fkey` (`song_id`);

--
-- A tábla indexei `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Playlist_user_id_name_key` (`user_id`,`name`);

--
-- A tábla indexei `playlistsong`
--
ALTER TABLE `playlistsong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PlaylistSong_playlist_id_fkey` (`playlist_id`),
  ADD KEY `PlaylistSong_song_id_fkey` (`song_id`);

--
-- A tábla indexei `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`token`),
  ADD KEY `Token_userId_fkey` (`userId`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email_key` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `playlistsong`
--
ALTER TABLE `playlistsong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_song_id_fkey` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `playlist`
--
ALTER TABLE `playlist`
  ADD CONSTRAINT `Playlist_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `playlistsong`
--
ALTER TABLE `playlistsong`
  ADD CONSTRAINT `PlaylistSong_playlist_id_fkey` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PlaylistSong_song_id_fkey` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
