import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaPlay, FaPause, FaHeart } from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import { usePlayer } from "../../components/services/service/PlayerContext";
import { usePlaylists } from "../../components/services/service/PlaylistContext";
//import "./Playlists.css";

interface Playlist {
    id: number;
    name: string;
    description: string | null;
    coverImagePath?: string;
    songsCount: number;
    created_at: string;
    isLikedPlaylist?: boolean;
    color?: string;
}


const Playlists: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { currentSong, isPlaying, setCurrentSong, setIsPlaying } = usePlayer();
    const { likedSongs } = usePlaylists();
    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to view your playlists");
                setLoading(false);
                return;
            }
            const response = await axios.get(
                `${apiBaseUrl}/playlists/user`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const fetchedPlaylists = response.data;

            const processedPlaylists = fetchedPlaylists.map((playlist: Playlist) => {
                const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 30%)`;
                if (playlist.name === "Liked Songs") {
                    return { ...playlist, isLikedPlaylist: true, color: "#1e3a8a" };
                }
                return { ...playlist, color };
            });

            setPlaylists(processedPlaylists);
        } catch (err) {
            console.error("Failed to load playlists:", err);
            setError("Failed to load your playlists");
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    const isPlaylistCurrentlyPlaying = (playlistId: number) => {
        if (!currentSong || !isPlaying) return false;
        return false
    };

    const handlePlayPlaylist = (playlistId: number) => {
        navigate(`/playlist/${playlistId}`);
    };

    const createNewPlaylist = () => {
        navigate("/playlists/create");
    };

    const filteredPlaylists = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (playlist.description && playlist.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="playlists-page-container">
                <Navbar onSearch={handleSearch} />
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your playlists...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="playlists-page-container">
                <Navbar onSearch={handleSearch} />
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => navigate("/login")} className="create-playlist-button">
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="playlists-page-container">
            <Navbar onSearch={handleSearch} />

            <div className="playlists-page">
                <div className="playlists-header">
                    <div className="playlists-title-section">
                        <h1>Your Playlists</h1>
                        <p>{playlists.length} playlists available</p>
                    </div>
                    <button className="create-playlist-button" onClick={createNewPlaylist}>
                        <FaPlus /> Create New Playlist
                    </button>
                </div>

                {filteredPlaylists.length === 0 ? (
                    <div className="empty-playlists">
                        <div className="empty-playlists-content">
                            {searchTerm ? (
                                <>
                                    <h2>No results found</h2>
                                    <p>No playlists match your search term "{searchTerm}"</p>
                                </>
                            ) : (
                                <>
                                    <h2>You don't have any playlists yet</h2>
                                    <p>Create your first playlist to start organizing your music</p>
                                    <button className="start-playlist-button" onClick={createNewPlaylist}>
                                        <FaPlus /> Create Your First Playlist
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="playlists-grid">
                        {filteredPlaylists.map((playlist) => (
                            <div className="playlist-card" key={playlist.id}>
                                <div className="playlist-card-cover-container">
                                    {playlist.coverImagePath ? (
                                        <img
                                            className="playlist-card-cover"
                                            src={`${apiBaseUrl}${playlist.coverImagePath}`}
                                            alt={`${playlist.name} cover`}
                                        />
                                    ) : (
                                        <div
                                            className="playlist-card-cover"
                                            style={{
                                                backgroundColor: playlist.color,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "36px",
                                                color: "white"
                                            }}
                                        >

                                            {playlist.isLikedPlaylist ? (
                                                <FaHeart />
                                            ) : (
                                                playlist.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    )}
                                    <div className="playlist-card-overlay">
                                        <button
                                            className="play-button"
                                            onClick={() => handlePlayPlaylist(playlist.id)}
                                            aria-label={`Play ${playlist.name}`}
                                        >
                                            {isPlaylistCurrentlyPlaying(playlist.id) ? <FaPause /> : <FaPlay />}
                                        </button>
                                    </div>
                                </div>
                                <div className="playlist-card-info">
                                    <Link to={`/playlist/${playlist.id}`} className="playlist-name-link">
                                        <h3 className="playlist-card-name">{playlist.name}</h3>
                                    </Link>
                                    <div className="playlist-card-meta">
                                        <span>{playlist.description}</span>
                                        <span>Created: {formatDate(playlist.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Playlists;