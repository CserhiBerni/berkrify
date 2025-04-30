import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Song } from "../../components/services/class/types";
import { getSongs } from "../../components/services/service/songService";
import { FaPlay, FaPause, FaShuffle, FaHeart } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa"
import { ImLoop } from "react-icons/im";
import MusicPlayer from "../../components/musicplayer/MusicPlayer";
import Navbar from "../../components/navbar/Navbar";
import { usePlayer } from "../../components/services/service/PlayerContext";
import { usePlaylists } from "../../components/services/service/PlaylistContext";
import "./AlbumPage.css";

const AlbumPage: React.FC = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const {
    isLiked,
    addToLikedSongs,
    removeFromLikedSongs
  } = usePlaylists();

  const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    allSongs,
    setAllSongs,
    shuffle,
    setShuffle,
    loop,
    setLoop
  } = usePlayer();

  const [albumInfo, setAlbumInfo] = useState<{
    cover: string;
    artist: string;
    releaseYear: number;
    totalDuration: number;
    genre: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [coverExpanded, setCoverExpanded] = useState(false);

  const coverModalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [albumName]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        let songsData = allSongs;
        if (songsData.length === 0) {
          songsData = await getSongs();
          setAllSongs(songsData);
        }

        if (albumName) {
          const filteredSongs = songsData.filter(
            (song) => song.album.toLowerCase() === decodeURIComponent(albumName).toLowerCase()
          );

          if (filteredSongs.length > 0) {
            setAlbumSongs(filteredSongs);

            const firstSong = filteredSongs[0];
            const totalDuration = filteredSongs.reduce(
              (total, song) => total + song.length,
              0
            );

            setAlbumInfo({
              cover: firstSong.cover || "/default-cover.jpg",
              artist: firstSong.artist,
              releaseYear: firstSong.release_yr,
              totalDuration,
              genre: firstSong.genre,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [albumName, allSongs, setAllSongs]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && coverExpanded) {
        setCoverExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [coverExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (coverModalRef.current && !coverModalRef.current.contains(event.target as Node)) {
        setCoverExpanded(false);
      }
    };

    if (coverExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [coverExpanded]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleToggleLike = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked(song.id)) {
      removeFromLikedSongs(song.id);
    } else {
      addToLikedSongs(song);
    }
  };

  const handlePlayAlbum = () => {
    if (albumSongs.length > 0) {
      if (isAlbumPlaying) {
        setIsPlaying(false);
      }
      else if (isCurrentSongInAlbum()) {
        setIsPlaying(true);
      }
      else {
        setCurrentSong(albumSongs[0]);

        setTimeout(() => {
          setIsPlaying(true);
        }, 50);
      }
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const handleToggleLoop = () => {
    setLoop(!loop);
  };

  const toggleCoverExpand = () => {
    setCoverExpanded((prev: boolean) => !prev);
  };

  const isCurrentSongInAlbum = () => {
    if (!currentSong || albumSongs.length === 0) return false;
    return albumSongs.some(song => song.id === currentSong.id);
  };

  const playNextSong = () => {
    if (!currentSong || albumSongs.length === 0) return;

    const currentIndex = albumSongs.findIndex((s) => s.id === currentSong.id);

    if (currentIndex === -1) {
      setCurrentSong(albumSongs[0]);
      return;
    }

    if (shuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * albumSongs.length);
      } while (randomIndex === currentIndex && albumSongs.length > 1);
      setCurrentSong(albumSongs[randomIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % albumSongs.length;
      setCurrentSong(albumSongs[nextIndex]);
    }
  };

  const playPreviousSong = () => {
    if (!currentSong || albumSongs.length === 0) return;

    const currentIndex = albumSongs.findIndex((s) => s.id === currentSong.id);

    if (currentIndex === -1) {
      setCurrentSong(albumSongs[0]);
      return;
    }

    if (shuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * albumSongs.length);
      } while (randomIndex === currentIndex && albumSongs.length > 1);
      setCurrentSong(albumSongs[randomIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + albumSongs.length) % albumSongs.length;
      setCurrentSong(albumSongs[prevIndex]);
    }
  };

  const isAlbumPlaying = isPlaying && isCurrentSongInAlbum();

  return (
    <div className="album-page-container">
      {coverExpanded && albumInfo && (
        <div className="expanded-cover-backdrop">
          <div className="expanded-cover-container" ref={coverModalRef}>
            <button className="close-expanded-cover" onClick={toggleCoverExpand}>
              <FaTimes />
            </button>
            <div className="expanded-cover-content">
              <img
                src={albumInfo.cover}
                alt={`${albumName} cover`}
                className="expanded-cover-image"
              />
              <div className="expanded-cover-info">
                <h2 className="expanded-song-title">{albumName}</h2>
                <h3 className="expanded-artist-name">{albumInfo.artist}</h3>
                <p className="expanded-year">{albumInfo.releaseYear}</p>
                <p className="expanded-album-name">{albumInfo.genre}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar onSearch={(query) => setSearchTerm(query)} />

      <div className="album-page">
        {albumInfo ? (
          <>
            <div className="album-header">
              <div className="album-cover-container" onClick={toggleCoverExpand}>
                <img
                  src={albumInfo.cover}
                  alt={`${albumName} cover`}
                  className="album-cover"
                />
              </div>
              <div className="album-info">
                <h1 className="album-title">{albumName}</h1>
                <p className="album-artist">{albumInfo.artist}</p>
                <div className="album-meta">
                  <span className="album-year">{albumInfo.releaseYear}</span>
                  <span className="album-songs-count">{albumSongs.length} songs,</span>
                  <span className="album-duration">
                    {formatTotalDuration(albumInfo.totalDuration)}
                  </span>
                  <span className="album-genre">{albumInfo.genre}</span>
                </div>
                <div className="album-controls">
                  <button
                    className="album-play-button"
                    onClick={isAlbumPlaying ? handleTogglePlay : handlePlayAlbum}
                  >
                    {isAlbumPlaying ? <FaPause /> : <FaPlay />}
                    <span>{isAlbumPlaying ? "Pause" : "Play"}</span>
                  </button>
                  <button
                    className={`control-button ${shuffle ? "active" : ""}`}
                    onClick={handleToggleShuffle}
                  >
                    <FaShuffle />
                  </button>
                  <button
                    className={`control-button ${loop ? "active" : ""}`}
                    onClick={handleToggleLoop}
                  >
                    <ImLoop />
                  </button>
                </div>
              </div>
            </div>

            <div className="album-songs-container">
              <div className="songs-header">
                <div className="song-number">#</div>
                <div className="song-title">Title</div>
                <div className="song-artist">Artist</div>
                <div className="song-duration">Duration</div>
                <div></div>
              </div>

              <div className="songs-list">
                {albumSongs.map((song, index) => {
                  const isCurrentSong = currentSong?.id === song.id;

                  return (
                    <div
                      key={song.id}
                      className={`song-item ${isCurrentSong ? "current-song" : ""}`}
                      onClick={() => handlePlaySong(song)}
                    >
                      <div className="song-number">
                        {isCurrentSong && isPlaying ? (
                          <div className="playing-animation">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="song-title">
                        <span className="song-name">{song.song}</span>
                      </div>
                      <div className="song-artist">{song.artist}</div>
                      <div className="song-duration">{formatDuration(song.length)}</div>
                      <div className="song-actions">
                        <button
                          className={`like-song-button ${isLiked(song.id) ? "liked" : ""}`}
                          onClick={(e) => handleToggleLike(song, e)}
                          title={isLiked(song.id) ? "Unlike" : "Like"}
                        >
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="loading">Loading album...</div>
        )}

        <div className="back-button-container">
          <Link to="/" className="back-button">Back to Library</Link>
        </div>
      </div>

      {currentSong && (
        <div className="music-player-container">
          <MusicPlayer
            song={currentSong}
            songs={isCurrentSongInAlbum() ? albumSongs : allSongs}
            onSongChange={handlePlaySong}
            onPlayNext={isCurrentSongInAlbum() ? playNextSong : undefined}
            onPlayPrevious={isCurrentSongInAlbum() ? playPreviousSong : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default AlbumPage;