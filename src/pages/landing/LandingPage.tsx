import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import SearchResults from "../../components/navbar/SearchResults";
import MusicList from "../../components/musiclist/MusicList";
import MusicPlayer from "../../components/musicplayer/MusicPlayer";
import { Song } from "../../components/services/class/types";
import { getSongs } from "../../components/services/service/songService";
import { usePlayer } from "../../components/services/service/PlayerContext";

const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentSong, setCurrentSong, allSongs, setAllSongs } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      const data = await getSongs();
      setAllSongs(data);
    };
    
    fetchSongs();
  }, [setAllSongs]);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
  };

  return (
    <div className="landing-page">
    <Navbar onSearch={(query) => setSearchTerm(query)}/>
      {searchTerm && <SearchResults searchTerm={searchTerm} onPlay={handlePlaySong} />}
      <MusicList onPlay={handlePlaySong} />
      {currentSong && (
        <div className="music-player-container">
          <MusicPlayer
            song={currentSong}
            songs={allSongs}
            onSongChange={handlePlaySong}
          />
        </div>
      )}
    </div>
  );
};

export default LandingPage;