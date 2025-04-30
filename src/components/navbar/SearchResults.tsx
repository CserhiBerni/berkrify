import React, { useEffect, useState } from "react";
import { getSongs } from "../services/service/songService";
import { Song } from "../services/class/types";
import MusicCard from "../musiccard/MusicCard";
import "./SearchResults.css";

interface SearchResultsProps {
  searchTerm: string;
  onPlay: (song: Song) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm, onPlay }) => {
  const [results, setResults] = useState<Song[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const allSongs = await getSongs();
      const filtered = allSongs.filter(
        (song) =>
          song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.song.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    };
    fetchResults();
  }, [searchTerm]);

  return (
    <div className="search-results-container">
      <h2>Search results</h2>
      {results.length > 0 ? (
        <div className="card-container">
          {results.map((song) => (
            <div key={song.id} className="card-wrapper">
              <MusicCard song={song} onPlay={() => onPlay(song)} />
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;