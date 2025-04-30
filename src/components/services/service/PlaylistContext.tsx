import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

interface Song {
  id: string | number;
  song: string;
  artist: string;
  album?: string;
  cover?: string;
  release_yr?: number;
  path?: string;
}

interface Playlist {
  id: number;
  name: string;
  description: string | null;
  coverImagePath?: string;
  songsCount: number;
  songs: Song[];
  created_at: string;
}

interface PlaylistContextType {
  playlists: Playlist[];
  likedSongs: Song[];
  addToLikedSongs: (song: Song) => void;
  removeFromLikedSongs: (songId: string | number, playlistViewId?: number) => void;
  isLiked: (songId: string | number) => boolean;
  addSongToPlaylist: (songId: string | number, playlistId: number) => Promise<boolean>;
  removeSongFromPlaylist: (songId: string | number, playlistId: number) => Promise<boolean>;
  createPlaylist: (name: string, description?: string) => Promise<number | null>;
  fetchPlaylists: () => Promise<void>;
  fetchLikedSongs: () => Promise<void>;
  resetPlaylistState: () => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState<number | null>(null);
  const currentUserId = useRef<string | null>(null);
  
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const resetPlaylistState = useCallback(() => {
    setPlaylists([]);
    setLikedSongs([]);
    setLikedSongsPlaylistId(null);
    currentUserId.current = null;
  }, []);

  const fetchPlaylists = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPlaylists([]);
        return;
      }

      const response = await axios.get(
        `${apiBaseUrl}/playlists/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setPlaylists(response.data);
      
      const likedPlaylist = response.data.find((p: Playlist) => p.name === "Liked Songs");
      if (likedPlaylist) {
        setLikedSongsPlaylistId(likedPlaylist.id);
      }
    } catch (err) {
      console.error("Failed to load playlists:", err);
      setPlaylists([]);
    }
  }, [apiBaseUrl]);

  const fetchLikedSongs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLikedSongs([]);
        return;
      }
      
      const response = await axios.get(
        `${apiBaseUrl}/favorites`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      let likedSongsData: Song[] = [];
      if (Array.isArray(response.data)) {
        likedSongsData = response.data.map((item: any) => {
          return item.song || item;
        });
      }
      
      setLikedSongs(likedSongsData);
    } catch (error) {
      console.error("Failed to fetch liked songs:", error);
      setLikedSongs([]);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        resetPlaylistState();
        return;
      }
      
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          currentUserId.current = user.id;
        }
      } catch (error) {
        console.error("Error parsing user data");
      }
      
      await fetchPlaylists();
      await fetchLikedSongs();
    };
    
    initialize();
  }, [fetchPlaylists, fetchLikedSongs, resetPlaylistState]);
  
  useEffect(() => {
    const ensureLikedSongsPlaylist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const likedPlaylist = playlists.find(p => p.name === "Liked Songs");
      
      if (!likedPlaylist) {
        try {
          const response = await axios.post(
            `${apiBaseUrl}/playlists`,
            {
              name: "Liked Songs",
              description: "Songs you've liked"
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          
          if (response.data && response.data.id) {
            setLikedSongsPlaylistId(response.data.id);
            fetchPlaylists();
          }
        } catch (err) {
          console.error("Failed to create Liked Songs playlist:", err);
        }
      }
    };
    
    ensureLikedSongsPlaylist();
  }, [playlists, apiBaseUrl, fetchPlaylists]);

  useEffect(() => {
    const handleLogout = () => {
      resetPlaylistState();
    };

    const handleLogin = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.id !== currentUserId.current) {
            resetPlaylistState();
            currentUserId.current = user.id;
            fetchPlaylists();
            fetchLikedSongs();
          }
        } catch (e) {
          console.error("Error parsing user data");
        }
      }
    };
    
    window.addEventListener('user-logout', handleLogout);
    window.addEventListener('user-login', handleLogin);
    
    return () => {
      window.removeEventListener('user-logout', handleLogout);
      window.removeEventListener('user-login', handleLogin);
    };
  }, [resetPlaylistState, fetchPlaylists, fetchLikedSongs]);

  const addToLikedSongs = async (song: Song) => {
    if (!song) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      setLikedSongs(prev => {
        if (!prev.some(s => s.id === song.id)) {
          return [...prev, song];
        }
        return prev;
      });
      
      await axios.post(
        `${apiBaseUrl}/favorites`,
        { song_id: song.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (likedSongsPlaylistId) {
        await addSongToPlaylist(song.id, likedSongsPlaylistId);
      }
    } catch (error) {
      console.error("Error adding song to liked songs:", error);
      fetchLikedSongs();
    }
  };
  
  const removeFromLikedSongs = async (songId: string | number, playlistViewId?: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      setLikedSongs(prev => prev.filter(song => song.id !== songId));
      
      if (playlistViewId && likedSongsPlaylistId === playlistViewId) {
        if (window.dispatchEvent) {
          const event = new CustomEvent('playlistSongRemoved', { 
            detail: { songId, playlistId: playlistViewId } 
          });
          window.dispatchEvent(event);
        }
      }
      
      await axios.delete(
        `${apiBaseUrl}/favorites/song/${songId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (likedSongsPlaylistId) {
        await axios.delete(
          `${apiBaseUrl}/playlists/${likedSongsPlaylistId}/songs/${songId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        fetchPlaylists();
      }
    } catch (error) {
      console.error("Error removing song from liked songs:", error);
      fetchLikedSongs();
    }
  };
  
  const addSongToPlaylist = async (songId: string | number, playlistId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      
      await axios.post(
        `${apiBaseUrl}/playlists/${playlistId}/songs`,
        { 
          song_id: songId,
          position: 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchPlaylists();
      return true;
    } catch (error) {
      console.error(`Error adding song ${songId} to playlist ${playlistId}:`, error);
      return false;
    }
  };

  const removeSongFromPlaylist = async (songId: string | number, playlistId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      await axios.delete(
        `${apiBaseUrl}/playlists/${playlistId}/songs/${songId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchPlaylists();
      return true;
    } catch (error) {
      console.error(`Error removing song ${songId} from playlist ${playlistId}:`, error);
      return false;
    }
  };

  const isLiked = (songId?: string | number): boolean => {
    if (!songId) return false;
    return likedSongs.some(song => song.id === songId);
  };

  const createPlaylist = async (name: string, description?: string): Promise<number | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await axios.post(
        `${apiBaseUrl}/playlists`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchPlaylists();
      return response.data.id;
    } catch (error) {
      console.error("Error creating playlist:", error);
      return null;
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        likedSongs,
        addToLikedSongs,
        removeFromLikedSongs,
        isLiked,
        addSongToPlaylist,
        removeSongFromPlaylist,
        createPlaylist,
        fetchPlaylists,
        fetchLikedSongs,
        resetPlaylistState
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};