import axios from "axios";
import { Song } from "../class/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getSongById = async (id: string): Promise<Song> => {
  try {
    const response = await axios.get(`${API_URL}/songs/${id}`);
    const song = response.data;
    return {
      ...song,
      audioSrc: song.mp3.startsWith('http') ? song.mp3 : `${API_URL}/uploads/mp3/${song.mp3}`,
    };
  } catch (error) {
    console.error("Error fetching song:", error);
    throw error;
  }
};

export const getSongs = async (): Promise<Song[]> => {
  try {
    const response = await axios.get(`${API_URL}/songs`);

    if (Array.isArray(response.data)) {
      return response.data.map(song => ({
        ...song,
        audioSrc: song.mp3.startsWith("http") ? song.mp3 : `${API_URL}/uploads/mp3/${song.mp3}`,
      }));
    } else {
      console.error("API Error:", response.data);
      return [];
    }
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const loadAndPlaySong = (audioRef: React.RefObject<HTMLAudioElement>, song: Song) => {
  if (audioRef.current) {
    audioRef.current.src = song.audioSrc;
    audioRef.current.load();
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio playback started");
        })
        .catch(error => {
          console.error("Playback error:", error);
        });
    }
  } else {
    console.error("Audio element is not available");
  }
};