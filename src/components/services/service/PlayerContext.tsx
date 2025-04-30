import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Song } from '../class/types';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  loop: boolean;
  shuffle: boolean;
  allSongs: Song[];
  audioRef: React.RefObject<HTMLAudioElement>;
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setLoop: (loop: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setAllSongs: (songs: Song[]) => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  resetPlayerState: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const CURRENT_TIME_KEY = "audio_current_time";
  const PLAYING_STATUS_KEY = "audio_is_playing";
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  
  const resetPlayerState = useCallback(() => {
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVolume(80);
    setIsMuted(false);
    setLoop(false);
    setShuffle(false);
    localStorage.removeItem('currentSong');
    sessionStorage.removeItem(CURRENT_TIME_KEY);
    sessionStorage.removeItem(PLAYING_STATUS_KEY);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        
        const token = localStorage.getItem("token");
        if (!token) {
          setAllSongs([]);
          return;
        }
        
        const response = await fetch(`${apiBaseUrl}/songs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        setAllSongs(data);
      } catch (error) {
        console.error('Failed to fetch songs:', error);
        setAllSongs([]);
      }
    };
    
    fetchSongs();
    
    return () => {
      audioRef.current.pause();
    };
  }, []);
  
  useEffect(() => {
    if (currentSong) {
      const audioSrc = currentSong.audioSrc || currentSong.path;
      
      if (audioSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
        
        if (isPlaying) {
          audioRef.current.play().catch(err => {
            console.error('Error playing audio:', err);
          });
        }
      } else {
        console.error('No audio source found for song:', currentSong);
      }
    }
  }, [currentSong]);
  
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);
  
  useEffect(() => {
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (currentTime > 0) {
      sessionStorage.setItem(CURRENT_TIME_KEY, currentTime.toString());
    }
  }, [currentTime, CURRENT_TIME_KEY]);

  useEffect(() => {
    sessionStorage.setItem(PLAYING_STATUS_KEY, isPlaying.toString());
  }, [isPlaying, PLAYING_STATUS_KEY]);
  
  useEffect(() => {
    const audio = audioRef.current;
    
    const savedTime = sessionStorage.getItem(CURRENT_TIME_KEY);
    if (savedTime && audio) {
      const timeValue = parseFloat(savedTime);
      if (!isNaN(timeValue)) {
        audio.currentTime = timeValue;
        setCurrentTime(timeValue);
      }
    }
    
    const handleTimeUpdate = () => {
      if (audio.currentTime > 0) {
        setCurrentTime(audio.currentTime);
      }
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      if (loop) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNextSong();
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [loop]);

  useEffect(() => {
    const handleLogout = () => {
      resetPlayerState();
    };

    window.addEventListener('user-logout', handleLogout);
    return () => {
      window.removeEventListener('user-logout', handleLogout);
    };
  }, [resetPlayerState]);
  
  const playNextSong = () => {
    if (!currentSong || allSongs.length === 0) return;
    
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * allSongs.length);
      } while (nextIndex === currentIndex && allSongs.length > 1);
    } else {
      nextIndex = (currentIndex + 1) % allSongs.length;
    }
    
    setCurrentSong(allSongs[nextIndex]);
  };
  
  const playPreviousSong = () => {
    if (!currentSong || allSongs.length === 0) return;
    
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1) return;
    
    let prevIndex;
    if (shuffle) {
      do {
        prevIndex = Math.floor(Math.random() * allSongs.length);
      } while (prevIndex === currentIndex && allSongs.length > 1);
    } else {
      prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    }
    
    setCurrentSong(allSongs[prevIndex]);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        currentTime,
        duration,
        isMuted,
        loop,
        shuffle,
        allSongs,
        audioRef,
        setCurrentSong,
        setIsPlaying,
        setVolume,
        setCurrentTime,
        setDuration,
        setIsMuted,
        setLoop,
        setShuffle,
        setAllSongs,
        playNextSong,
        playPreviousSong,
        resetPlayerState
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};