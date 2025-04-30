import React, { useState, useEffect, useRef } from "react";
import { MusicPlayerProps } from "../services/class/types";
import { FaPlay, FaPause, FaVolumeUp, FaStepBackward, FaStepForward, FaVolumeMute, FaTimes } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { ImLoop } from "react-icons/im";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import Slider from "@mui/material/Slider";
import { usePlayer } from "../services/service/PlayerContext";
import { usePlaylists } from "../services/service/PlaylistContext";
import "./MusicPlayer.css";

const PLAYER_COLLAPSED_KEY = "musicPlayerCollapsed";
const LAST_LOADED_SONG_KEY = "last_loaded_song_id";
const LIKED_SONGS_PLAYLIST_NAME = "Liked Songs";

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  song,
  songs,
  onSongChange,
  onPlayNext,
  onPlayPrevious
}) => {
  const {
    isPlaying, setIsPlaying,
    currentTime, setCurrentTime,
    duration, setDuration,
    volume, setVolume,
    isMuted, setIsMuted,
    audioRef,
    loop, setLoop,
    shuffle, setShuffle,
    playNextSong: globalPlayNextSong,
    playPreviousSong: globalPlayPreviousSong
  } = usePlayer();

  const {
    playlists,
    likedSongs,
    addToLikedSongs,
    removeFromLikedSongs,
    isLiked,
    addSongToPlaylist,
    createPlaylist,
    fetchPlaylists
  } = usePlaylists();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem(PLAYER_COLLAPSED_KEY);
    return savedState ? JSON.parse(savedState) : false;
  });

  const [lastLoadedSongId, setLastLoadedSongId] = useState<number | null>(() => {
    const savedId = sessionStorage.getItem(LAST_LOADED_SONG_KEY);
    return savedId ? parseInt(savedId, 10) : null;
  });

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [coverExpanded, setCoverExpanded] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const [audioLoadError, setAudioLoadError] = useState(false);
  const [isChangingSong, setIsChangingSong] = useState(false);

  const isSeeking = useRef(false);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const coverModalRef = useRef<HTMLDivElement | null>(null);
  const playlistModalRef = useRef<HTMLDivElement | null>(null);
  const createPlaylistModalRef = useRef<HTMLDivElement | null>(null);
  const songTitleRef = useRef<HTMLDivElement | null>(null);
  const audioLoadingRef = useRef(false);

  if (!song) return null;

  useEffect(() => {
    localStorage.setItem("musicPlayerCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current && containerRef.current) {
        const titleWidth = titleRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        setIsScrolling(titleWidth > containerWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    if (lastLoadedSongId === song.id) {
      console.log("Song already loaded, not reloading:", song.id);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);

      setIsChangingSong(false);
      setAudioLoadError(false);

      return;
    }

    console.log("Loading new song:", song.id);

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    setAudioLoadError(false);
    setIsChangingSong(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const songAny = song as any;

    let audioSrc = "";

    if (songAny && typeof songAny.mp3 === 'string') {
      audioSrc = songAny.mp3.startsWith('http') ? songAny.mp3 : `${API_URL}/uploads/mp3/${songAny.mp3}`;
    } else if (song.audioSrc) {
      audioSrc = song.audioSrc.startsWith('http') ? song.audioSrc : `${API_URL}/uploads/mp3/${song.audioSrc}`;
    } else if (song.path) {
      audioSrc = song.path.startsWith('http') ? song.path : `${API_URL}/uploads/mp3/${song.path}`;
    }

    console.log("Loading audio source:", audioSrc, "for song:", song.id);

    if (!audioSrc) {
      console.error("No valid audio source found for song:", song.id);
      setAudioLoadError(true);
      setIsChangingSong(false);
      return;
    }

    const wasPlaying = isPlaying;
    if (wasPlaying) {
      setIsPlaying(false);
    }

    audio.src = audioSrc;
    audioLoadingRef.current = true;
    audio.load();

    const handleCanPlayThrough = () => {
      audioLoadingRef.current = false;
      setIsChangingSong(false);
      setLastLoadedSongId(song.id);
      sessionStorage.setItem(LAST_LOADED_SONG_KEY, song.id.toString());

      if (wasPlaying || sessionStorage.getItem('autoplay_next') === 'true') {
        sessionStorage.removeItem('autoplay_next');
        setTimeout(() => {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
            }).catch(err => {
              console.error("Error playing audio:", err);
              setIsPlaying(false);
            });
          }
        }, 100);
      }
    };

    const handleMetadataLoaded = () => {
      setDuration(audio.duration || 0);
    };

    const handleError = (e: Event) => {
      console.error("Audio loading error:", e);
      setAudioLoadError(true);
      audioLoadingRef.current = false;
      setIsChangingSong(false);
    };

    audio.addEventListener("loadedmetadata", handleMetadataLoaded, { once: true });
    audio.addEventListener("canplaythrough", handleCanPlayThrough, { once: true });
    audio.addEventListener("error", handleError, { once: true });

    audio.volume = volume / 100;
    audio.muted = isMuted;

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadataLoaded);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("error", handleError);
    };
  }, [song?.id, lastLoadedSongId, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    if (isPlaying && audio.paused && audio.readyState >= 3) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Playback error:", err);
          setIsPlaying(false);
        });
      }
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (loop) {
        audio.currentTime = 0;
        audio.play().catch(err => {
          console.error("Error restarting song:", err);
          setIsPlaying(false);
        });
      } else {
        handlePlayNext();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const marqueeElement = songTitleRef.current;
    if (marqueeElement) {
      if (isPlaying) {
        marqueeElement.classList.remove('paused');
      } else {
        marqueeElement.classList.add('paused');
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isSeeking.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
    };
  }, []);

  const togglePlay = () => {
    if (isChangingSong || audioLoadingRef.current) {
      return;
    }

    if (audioLoadError) {
      const audio = audioRef.current;
      if (audio && song) {
        audioLoadingRef.current = true;
        const audioSrc = song.audioSrc || song.path || "";

        audio.src = audioSrc;
        audio.load();
        setAudioLoadError(false);

        const handleCanPlay = () => {
          audioLoadingRef.current = false;
          setIsPlaying(true);
          audio.removeEventListener("canplaythrough", handleCanPlay);
        };

        audio.addEventListener("canplaythrough", handleCanPlay, { once: true });
        return;
      }
    }

    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) =>
    `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, "0")}`;

  const handleSeek = (e: Event, newValue: number | number[]) => {
    const newTime = Array.isArray(newValue) ? newValue[0] : newValue;
    setCurrentTime(newTime);
    if (audioRef) {
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    }
  };

  const startSeeking = () => {
    isSeeking.current = true;
  };

  const stopSeeking = () => {
    isSeeking.current = false;
  };

  const handleVolumeChange = (e: Event, newValue: number | number[]) => {
    const vol = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(vol);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleShuffle = () => {
    setShuffle(!shuffle);
    if (!shuffle) setLoop(false);
  };

  const handleLoop = () => {
    setLoop(!loop);
    if (!loop) setShuffle(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev: boolean) => !prev);
  };

  const toggleCoverExpand = () => {
    setCoverExpanded((prev: boolean) => !prev);
  };

  const handlePlayNext = () => {
    setIsChangingSong(true);

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setAudioLoadError(false);
    }

    try {
      if (onPlayNext) {
        onPlayNext();
      } else if (globalPlayNextSong) {
        globalPlayNextSong();
      }

      sessionStorage.setItem('autoplay_next', 'true');

      setIsPlaying(true);
    } catch (err) {
      setAudioLoadError(true);
      setIsChangingSong(false);
    }
  };

  const handlePlayPrevious = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    setIsChangingSong(true);

    if (audio) {
      audio.pause();
      setAudioLoadError(false);
    }

    try {
      if (onPlayPrevious) {
        onPlayPrevious();
      } else if (globalPlayPreviousSong) {
        globalPlayPreviousSong();
      }

      sessionStorage.setItem('autoplay_next', 'true');

      setIsPlaying(true);
    } catch (err) {
      setAudioLoadError(true);
      setIsChangingSong(false);
    }
  };


  const toggleLike = () => {
    if (song) {
      if (isLiked(song.id)) {
        removeFromLikedSongs(song.id);
      } else {
        addToLikedSongs(song);
      }
    }
  };

  const handleAddToPlaylist = () => {
    fetchPlaylists();
    setShowPlaylistModal(true);
  };

  const handleAddSongToPlaylist = async (playlistId: number) => {
    if (song) {
      setAddingToPlaylist(true);
      try {
        await addSongToPlaylist(song.id, playlistId);
        setShowPlaylistModal(false);
      } catch (error) {
        console.error("Error adding song to playlist:", error);
      } finally {
        setAddingToPlaylist(false);
      }
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const newPlaylistId = await createPlaylist(newPlaylistName, newPlaylistDescription);
      if (newPlaylistId && song) {
        await addSongToPlaylist(song.id, newPlaylistId);
      }
      setShowCreatePlaylistModal(false);
      await fetchPlaylists();
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name !== LIKED_SONGS_PLAYLIST_NAME
  );

  const totalTimeStr = formatTime(duration);
  const currentTimeStr = formatTime(currentTime);

  return (
    <>
      {coverExpanded && (
        <div className="expanded-cover-backdrop">
          <div className="expanded-cover-container" ref={coverModalRef}>
            <button className="close-expanded-cover" onClick={toggleCoverExpand}>
              <FaTimes />
            </button>
            <div className="expanded-cover-content">
              <img
                src={song.cover || "/default-cover.jpg"}
                alt={`${song.song} by ${song.artist}`}
                className="expanded-cover-image"
              />
              <div className="expanded-cover-info">
                <h2 className="expanded-song-title">{song.song}</h2>
                <h3 className="expanded-artist-name">{song.artist}</h3>
                {song.album && <p className="expanded-album-name">{song.album}</p>}
                {song.release_yr && <p className="expanded-year">{song.release_yr}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlaylistModal && (
        <div className="playlist-modal-backdrop">
          <div className="playlist-modal-container" ref={playlistModalRef}>
            <div className="playlist-modal-header">
              <h3>Add to Playlist</h3>
              <button className="close-modal" onClick={() => setShowPlaylistModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="playlist-modal-content">
              <div className="playlist-item" onClick={() => setShowCreatePlaylistModal(true)}>
                <span>+ Create New Playlist</span>
              </div>
              {filteredPlaylists.map(playlist => (
                <div
                  key={playlist.id}
                  className="playlist-item"
                  onClick={() => handleAddSongToPlaylist(playlist.id)}
                >
                  <span>{playlist.name}</span>
                </div>
              ))}
              {filteredPlaylists.length === 0 && (
                <div className="playlist-empty">
                  <span>No playlists yet. Create your first one!</span>
                </div>
              )}
              {addingToPlaylist && (
                <div className="playlist-loading">
                  <span>Adding to playlist...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreatePlaylistModal && (
        <div className="playlist-modal-backdrop">
          <div className="playlist-modal-container create-playlist-modal" ref={createPlaylistModalRef}>
            <div className="playlist-modal-header">
              <h3>Create New Playlist</h3>
              <button className="close-modal" onClick={() => setShowCreatePlaylistModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="playlist-modal-content">
              <div className="form-group">
                <label htmlFor="playlist-name">Playlist Name</label>
                <input
                  id="playlist-name"
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="playlist-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="playlist-description">Description</label>
                <textarea
                  id="playlist-description"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="What's this playlist about?"
                  className="playlist-textarea"
                />
              </div>
              <button
                className="create-playlist-submit"
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim() || addingToPlaylist}
              >
                {addingToPlaylist ? 'Creating...' : 'Create & Add Song'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`music-player ${isCollapsed ? "collapsed" : ""}`}>
        <div className="collapse-toggle" onClick={toggleCollapse}>
          {isCollapsed ? "◥" : "◣"}
        </div>
        <div className="player-content">
          <img
            src={song.cover || "/default-cover.jpg"}
            alt="cover"
            className="player-cover"
            onClick={toggleCoverExpand}
          />
          {!isCollapsed && (
            <div className="player-info">
              <div className="marquee-container" ref={containerRef}>
                {song.song.length > 40 ? (
                  <div
                    ref={songTitleRef}
                    className={`marquee-content ${isPlaying ? 'scrolling' : 'scrolling paused'}`}
                  >
                    <span className="song-title" ref={titleRef}>{song.song}</span>
                  </div>
                ) : (
                  <div className="song-title">{song.song}</div>
                )}
              </div>
              <div className="artist-name">{song.artist}</div>
            </div>
          )}
        </div>

        <div className="player-controls">
          <button className={`control-btn play-pause-btn ${isPlaying ? "active" : ""}`} onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <span className="current-time">{currentTimeStr}</span>
          <Slider
            min={0}
            max={duration || 1}
            value={currentTime}
            onChange={handleSeek}
            onMouseDown={startSeeking}
            onMouseUp={stopSeeking}
            className="seek-bar"
            sx={{
              color: "rgb(117, 86, 240)",
              "& .MuiSlider-rail": { backgroundColor: "grey" },
              "& .MuiSlider-thumb": {
                background: "linear-gradient(90deg, purple, violet)",
                width: "14px",
                height: "14px",
                opacity: 0,
                transition: "opacity 0.2s, transform 0.2s",
                "&:focus, &:active, &:hover, &.Mui-focusVisible": {
                  outline: "none",
                  boxShadow: "none",
                },
              },
              "&:hover .MuiSlider-thumb": { opacity: 1 },
            }}
          />
          <span className="duration">{totalTimeStr}</span>
        </div>

        <div className="player-buttons-container">
          <div className="player-buttons">
            {!isCollapsed && (
              <>
                <button className="control-btn" onClick={handlePlayPrevious}>
                  <FaStepBackward />
                </button>
                <button className={`control-btn ${shuffle ? "active" : ""}`} onClick={handleShuffle}>
                  <FaShuffle />
                </button>
                <button className={`control-btn ${loop ? "active" : ""}`} onClick={handleLoop}>
                  <ImLoop />
                </button>
                <button className="control-btn" onClick={handlePlayNext}>
                  <FaStepForward />
                </button>
              </>
            )}
          </div>

          <div className="action-buttons">
            <button className="action-btn add-btn" onClick={handleAddToPlaylist}>
              <IoAdd />
            </button>
            <button
              className={`action-btn like-btn ${isLiked(song?.id) ? "liked" : ""}`}
              onClick={toggleLike}
            >
              {isLiked(song?.id) ? <IoMdHeart /> : <IoMdHeartEmpty />}
            </button>
          </div>

          {!isCollapsed && (
            <div className="volume-container">
              <button className="control-btn" onClick={handleMuteToggle}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <Slider
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                sx={{
                  width: 60,
                  color: "rgb(117, 86, 240)",
                  "& .MuiSlider-rail": { backgroundColor: "grey" },
                  "& .MuiSlider-thumb": {
                    background: "linear-gradient(90deg, purple, violet)",
                    width: "14px",
                    height: "14px",
                    opacity: 0,
                    transition: "opacity 0.2s, transform 0.2s",
                    "&:focus, &:active, &:hover, &.Mui-focusVisible": {
                      outline: "none",
                      boxShadow: "none",
                    },
                  },
                  "&:hover .MuiSlider-thumb": { opacity: 1 },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;