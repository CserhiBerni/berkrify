import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import { usePlaylists } from "../../components/services/service/PlaylistContext";
import MusicPlayer from "../../components/musicplayer/MusicPlayer";
import { Song } from "../../components/services/class/types";
import { usePlayer } from "../../components/services/service/PlayerContext";
import { FaPlay, FaPause, FaTimes, FaPlus, FaHeart, FaEdit } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { ImLoop } from "react-icons/im";
import "./PlaylistPage.css";

interface PlaylistData {
    id: number;
    name: string;
    description: string | null;
    coverImagePath?: string;
    created_at: string;
    songs: {
        position: number;
        song: Song;
    }[];
}

const PlaylistPage: React.FC = () => {
    const { playlistId } = useParams<{ playlistId: string }>();
    const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [coverExpanded, setCoverExpanded] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [uploadedCover, setUploadedCover] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState("");

    const {
        currentSong,
        isPlaying,
        setCurrentSong,
        setIsPlaying,
        allSongs,
        loop,
        setLoop,
        shuffle,
        setShuffle
    } = usePlayer();

    const coverModalRef = React.useRef<HTMLDivElement | null>(null);
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const {
        isLiked,
        addToLikedSongs,
        removeFromLikedSongs,
        fetchLikedSongs
    } = usePlaylists();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [playlistId]);

    useEffect(() => {
        if (playlistId && !loading) {
            const cachedPlaylist = sessionStorage.getItem(`playlist_${playlistId}`);
            if (cachedPlaylist && playlist) {
                try {
                    const parsedPlaylist = JSON.parse(cachedPlaylist);
                    if (
                        parsedPlaylist.name !== playlist.name ||
                        parsedPlaylist.description !== playlist.description ||
                        parsedPlaylist.coverImagePath !== playlist.coverImagePath
                    ) {
                        setPlaylist(prev => {
                            if (!prev) return null;
                            return {
                                ...prev,
                                name: parsedPlaylist.name,
                                description: parsedPlaylist.description,
                                coverImagePath: parsedPlaylist.coverImagePath
                            };
                        });
                    }
                } catch (error) {
                    console.error("Error parsing cached playlist:", error);
                }
            }
        }
    }, [playlistId, loading]);


    useEffect(() => {
        const fetchPlaylistData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Please login to view playlists");
                    setLoading(false);
                    return;
                }

                const cachedPlaylist = sessionStorage.getItem(`playlist_${playlistId}`);
                let initialData;

                const response = await axios.get(`${apiBaseUrl}/playlists/${playlistId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const fixedSongs = response.data.songs.map((item: any) => {
                    const song = item.song;
                    return {
                        ...item,
                        song: {
                            ...song,
                            audioSrc: song.mp3?.startsWith("http")
                                ? song.mp3
                                : `${apiBaseUrl}/uploads/mp3/${song.mp3}`
                        }
                    };
                });

                initialData = {
                    ...response.data,
                    songs: fixedSongs
                };

                if (cachedPlaylist) {
                    try {
                        const parsedCache = JSON.parse(cachedPlaylist);
                        initialData = {
                            ...initialData,
                            name: parsedCache.name,
                            description: parsedCache.description,
                            coverImagePath: parsedCache.coverImagePath
                        };
                    } catch (error) {
                        console.error("Error parsing cached playlist:", error);
                    }
                }

                setPlaylist(initialData);
            } catch (err) {
                setError("Failed to load playlist");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistData();
    }, [playlistId, apiBaseUrl]);

    useEffect(() => {
        fetchLikedSongs();
    }, [fetchLikedSongs]);

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

    const handleToggleLike = (song: Song, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked(song.id)) {
            removeFromLikedSongs(song.id);
        } else {
            addToLikedSongs(song);
        }
    };

    const handlePlaySong = (song: Song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const handlePlayPlaylist = () => {
        if (!playlist || playlist.songs.length === 0) return;

        if (isPlaying && isCurrentSongInPlaylist()) {
            setIsPlaying(false);
        }
        else if (!isPlaying && isCurrentSongInPlaylist()) {
            setIsPlaying(true);
        }
        else {
            const firstSong = playlist.songs[0].song;

            setCurrentSong(firstSong);
            setTimeout(() => {
                setIsPlaying(true);
            }, 50);
        }
    };

    const handleTogglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleToggleShuffle = () => {
        setShuffle(!shuffle);
        if (!shuffle) setLoop(false);
    };

    const handleToggleLoop = () => {
        setLoop(!loop);
        if (!loop) setShuffle(false);
    };

    const handleEditModalOpen = () => {
        if (playlist?.name === "Liked Songs") {
            alert("The Liked Songs playlist cannot be edited.");
            return;
        }

        setEditName(playlist?.name || "");
        setEditDescription(playlist?.description || "");

        const playlistCover = playlist?.coverImagePath
            ? (playlist.coverImagePath.startsWith('blob:')
                ? playlist.coverImagePath
                : `${apiBaseUrl}${playlist.coverImagePath}`)
            : "/default-playlist.jpg"

        setCoverPreview(playlistCover);
        setShowEditModal(true);
    };

    const isCoverExpandable = () => {
        return !!playlist?.coverImagePath;
    };

    const toggleCoverExpand = () => {
        setCoverExpanded(!coverExpanded);
    };

    const getRandomColor = (text: string): string => {
        if (!text) return "#1a1a2e";
        const colors = [
            "#4a148c", "#6a1b9a", "#8e24aa", "#aa00ff",
            "#283593", "#1565c0", "#0277bd", "#00838f",
            "#2e7d32", "#558b2f", "#9e9d24", "#f9a825"
        ];
        const charCode = text.charCodeAt(0);
        return colors[charCode % colors.length];
    };

    const handleRemoveSong = async (songId: number) => {
        try {
            if (playlist?.name === "Liked Songs") {
                alert("Cannot remove songs from Liked Songs playlist directly. Unlike the song instead.");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) return;
            await axios.delete(
                `${apiBaseUrl}/playlists/${playlistId}/songs/${songId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPlaylist((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    songs: prev.songs.filter((s) => s.song.id !== songId),
                };
            });
        } catch (err) {
            console.error("Failed to remove song from playlist:", err);
        }
    };

    const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            setUploadedCover(file);
            const imageUrl = URL.createObjectURL(file);
            setCoverPreview(imageUrl);

            console.log("Image preview set:", imageUrl);
        }
    };

    const handleSavePlaylist = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token || !playlistId) return;

            console.log("Attempting to update playlist:", { name: editName, description: editDescription });

            try {
                await axios.patch(
                    `${apiBaseUrl}/playlists/${playlistId}`,
                    {
                        name: editName,
                        description: editDescription || "",
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log("Playlist metadata updated");
            } catch (updateError) {
                console.error("Failed to update playlist metadata:", updateError);
            }

            if (uploadedCover) {
                try {
                    const formData = new FormData();
                    formData.append('file', uploadedCover);
                    const coverResponse = await axios.post(
                        `${apiBaseUrl}/playlists/upload/cover`,
                        formData,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );

                    console.log("Cover upload response:", coverResponse.data);

                    if (coverResponse.data && coverResponse.data.url) {
                        await axios.patch(
                            `${apiBaseUrl}/playlists/${playlistId}`,
                            {
                                coverImagePath: coverResponse.data.url
                            },
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        console.log("Playlist updated with new cover URL:", coverResponse.data.url);
                    }
                } catch (coverError) {
                    console.error("Failed to upload cover:", coverError);
                }
            }

            try {
                const updatedPlaylistResponse = await axios.get(
                    `${apiBaseUrl}/playlists/${playlistId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (updatedPlaylistResponse.data) {
                    const fixedSongs = updatedPlaylistResponse.data.songs.map((item: any) => {
                        const song = item.song;
                        return {
                            ...item,
                            song: {
                                ...song,
                                audioSrc: song.mp3?.startsWith("http")
                                    ? song.mp3
                                    : `${apiBaseUrl}/uploads/mp3/${song.mp3}`
                            }
                        };
                    });

                    const updatedPlaylist = {
                        ...updatedPlaylistResponse.data,
                        songs: fixedSongs
                    };

                    setPlaylist(updatedPlaylist);
                    sessionStorage.removeItem(`playlist_${playlistId}`);

                    console.log("Updated playlist with server data:", updatedPlaylist);
                }
            } catch (fetchError) {
                console.error("Failed to fetch updated playlist:", fetchError);
                if (playlist) {
                    const fallbackPlaylist = {
                        ...playlist,
                        name: editName,
                        description: editDescription
                    };

                    setPlaylist(fallbackPlaylist);
                    sessionStorage.setItem(`playlist_${playlistId}`, JSON.stringify(fallbackPlaylist));
                }
            }

            //success noti
            const notification = document.createElement('div');
            notification.textContent = 'Playlist updated successfully!';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(75, 181, 67, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 9999;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);

            setShowEditModal(false);
        } catch (err) {
            console.error("Failed to update playlist:", err);
            setShowEditModal(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const formatTotalDuration = (songs: { song: Song }[]) => {
        const totalSeconds = songs.reduce((total, s) => total + s.song.length, 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0) {
            return `${hours} hr ${minutes} min`;
        }
        return `${minutes} min`;
    };


    const playNextSong = () => {
        if (!playlist || playlist.songs.length === 0) return;
        const currentIndex = currentSong
            ? playlist.songs.findIndex(item => item.song.id === currentSong.id)
            : -1;
        let nextSong;
        if (currentIndex === -1) {
            nextSong = playlist.songs[0].song;
        } else if (shuffle) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * playlist.songs.length);
            } while (randomIndex === currentIndex && playlist.songs.length > 1);
            nextSong = playlist.songs[randomIndex].song;
        } else {
            const nextIndex = (currentIndex + 1) % playlist.songs.length;
            nextSong = playlist.songs[nextIndex].song;
        }
        setCurrentSong(nextSong);

        setTimeout(() => {
            setIsPlaying(true);
        }, 50);
    };


    const isCurrentSongInPlaylist = () => {
        if (!playlist || !currentSong) return false;
        return playlist.songs.some(item => item.song.id === currentSong.id);
    };

    const playPreviousSong = () => {
        if (!playlist || !currentSong) return;
        const currentIndex = playlist.songs.findIndex(item => item.song.id === currentSong.id);
        if (currentIndex === -1) {
            if (playlist.songs.length > 0) {
                setCurrentSong(playlist.songs[0].song);

                setTimeout(() => {
                    setIsPlaying(true);
                }, 50);
            }
            return;
        }
        let newSong;

        if (shuffle) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * playlist.songs.length);
            } while (randomIndex === currentIndex && playlist.songs.length > 1);
            newSong = playlist.songs[randomIndex].song;
        } else {
            const prevIndex = (currentIndex - 1 + playlist.songs.length) % playlist.songs.length;
            newSong = playlist.songs[prevIndex].song;
        }
        setCurrentSong(newSong);

        setTimeout(() => {
            setIsPlaying(true);
        }, 50);
    };

    if (loading) {
        return (
            <div className="playlist-page-container">
                <Navbar onSearch={(query) => setSearchTerm(query)} />
                <div className="loading">Loading playlist...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="playlist-page-container">
                <Navbar onSearch={(query) => setSearchTerm(query)} />
                <div className="error-message">{error}</div>
                <div className="back-button-container">
                    <Link to="/playlists" className="back-button">Back to Playlists</Link>
                </div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="playlist-page-container">
                <Navbar onSearch={(query) => setSearchTerm(query)} />
                <div className="error-message">Playlist not found</div>
                <div className="back-button-container">
                    <Link to="/playlists" className="back-button">Back to Playlists</Link>
                </div>
            </div>
        );
    }

    const playlistCover = playlist.coverImagePath
        ? (playlist.coverImagePath.startsWith('blob:')
            ? playlist.coverImagePath
            : `${apiBaseUrl}${playlist.coverImagePath}`)
        : playlist.songs[0]?.song.cover || "/default-playlist.jpg";

    const isPlaylistPlaying = isPlaying && isCurrentSongInPlaylist();

    return (
        <div className="playlist-page-container">
            <Navbar onSearch={(query) => setSearchTerm(query)} />
            {currentSong && (
                <MusicPlayer
                    song={currentSong}
                    songs={playlist.songs.map(item => item.song)}
                    onSongChange={(newSong) => {
                        setCurrentSong(newSong);
                        setIsPlaying(true);
                    }}
                    onPlayNext={playNextSong}
                    onPlayPrevious={playPreviousSong}
                />
            )}

            {coverExpanded && (
                <div className="expanded-cover-backdrop">
                    <div className="expanded-cover-container" ref={coverModalRef}>
                        <button className="close-expanded-cover" onClick={toggleCoverExpand}>
                            <FaTimes />
                        </button>
                        <div className="expanded-cover-content">
                            <img
                                src={playlistCover}
                                alt={`${playlist.name} cover`}
                                className="expanded-cover-image"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="playlist-page">
                <div className="playlist-header">
                    <div
                        className="playlist-cover-container"
                        onClick={isCoverExpandable() ? toggleCoverExpand : undefined}
                        style={isCoverExpandable() ? { cursor: 'pointer' } : {}}
                    >
                        {playlist.coverImagePath ? (
                            <img src={playlistCover} alt={playlist.name} className="playlist-cover" />
                        ) : playlist.name === "Liked Songs" ? (
                            <div className="playlist-liked-cover">
                                <FaHeart />
                            </div>
                        ) : (
                            <div
                                className="playlist-initial-cover"
                                style={{
                                    backgroundColor: `hsl(${playlist.name.charCodeAt(0) % 360}, 70%, 40%)`,
                                }}
                            >
                                {playlist.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="playlist-info">
                        <h1 className="playlist-title">{playlist.name}</h1>
                        {playlist.description && (
                            <p className="playlist-description">{playlist.description}</p>
                        )}
                        <div className="playlist-meta">
                            <span>{playlist.songs.length} songs</span>
                            {playlist.songs.length > 0 && (
                                <span>{formatTotalDuration(playlist.songs)}</span>
                            )}
                            <span>Created: {new Date(playlist.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="playlist-controls">
                            <button
                                className="playlist-play-button"
                                onClick={handlePlayPlaylist}
                            >
                                {isPlaylistPlaying ? <FaPause /> : <FaPlay />}
                                <span>{isPlaylistPlaying ? "Pause" : "Play"}</span>
                            </button>

                            {playlist?.name !== "Liked Songs" && (
                                <button
                                    className="edit-playlist-button"
                                    onClick={handleEditModalOpen}
                                    aria-label="Edit playlist"
                                >
                                    <FaEdit />
                                </button>
                            )}

                            <button
                                className={`control-button ${shuffle ? "active" : ""}`}
                                onClick={handleToggleShuffle}
                                title="Shuffle"
                            >
                                <FaShuffle />
                            </button>

                            <button
                                className={`control-button ${loop ? "active" : ""}`}
                                onClick={handleToggleLoop}
                                title="Loop"
                            >
                                <ImLoop />
                            </button>
                        </div>
                    </div>
                </div>

                {playlist.songs.length === 0 ? (
                    <div className="empty-playlist">
                        <p>This playlist is empty. Add some songs to get started!</p>
                        <Link to="/" className="browse-songs-button">
                            Browse Songs
                        </Link>
                    </div>
                ) : (
                    <div className="playlist-songs-container">
                        <div className="songs-header">
                            <div className="song-number">#</div>
                            <div>Title</div>
                            <div>Album</div>
                            <div>Artist</div>
                            <div className="song-duration">Duration</div>
                            <div className="song-actions"></div>
                        </div>
                        <div className="songs-list">
                            {playlist.songs.map((item, index) => {
                                const song = item.song;
                                const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;
                                return (
                                    <div
                                        key={index}
                                        className={`song-item ${currentSong?.id === song.id ? "current-song" : ""}`}
                                        onClick={() => handlePlaySong(song)}
                                    >
                                        <div className="song-number">
                                            {isCurrentlyPlaying ? (
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
                                            <div className="song-cover">
                                                <img
                                                    src={song.cover || "/default-cover.jpg"}
                                                    alt={song.song}
                                                />
                                            </div>
                                            <div className="song-info">
                                                <div className="song-name">{song.song}</div>
                                            </div>
                                        </div>
                                        <div className="song-album">
                                            {song.album ? (
                                                <Link
                                                    to={`/album/${song.album}`}
                                                    className="album-link"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {song.album}
                                                </Link>
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                        <div className="song-artist">{song.artist}</div>
                                        <div className="song-duration">
                                            {formatDuration(song.length || 0)}
                                        </div>
                                        <div className="song-actions">
                                            <button
                                                className={`like-song-button ${isLiked(item.song.id) ? "liked" : ""}`}
                                                onClick={(e) => handleToggleLike(item.song, e)}
                                            >
                                                <FaHeart />
                                            </button>

                                            {playlist?.name !== "Liked Songs" && (
                                                <button
                                                    className="remove-song-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveSong(item.song.id);
                                                    }}
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="back-button-container">
                    <Link to="/playlists" className="back-button">
                        Back to Playlists
                    </Link>
                </div>
            </div>

            {showEditModal && (
                <div className="modal-backdrop">
                    <div className="edit-playlist-modal">
                        <h2>Edit Playlist</h2>

                        <div className="edit-cover-container">
                            {coverPreview && coverPreview !== "/default-playlist.jpg" ? (
                                <img
                                    src={coverPreview}
                                    alt="Playlist cover"
                                    className="edit-cover-preview"
                                />
                            ) : (
                                <div className="edit-cover-preview playlist-initial-cover" style={{
                                    backgroundColor: getRandomColor(editName)
                                }}>
                                    {editName ? editName.charAt(0).toUpperCase() : "P"}
                                </div>
                            )}
                            <label className="upload-cover-btn">
                                <FaEdit />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Playlist name"
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={editDescription || ""}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Add an optional description"
                                maxLength={200}
                                rows={3}
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                className="cancel-button"
                                onClick={() => setShowEditModal(false)}
                            >
                                <span>Cancel</span>
                            </button>
                            <button
                                className="save-button"
                                onClick={handleSavePlaylist}
                                disabled={!editName.trim()}
                            >
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistPage;