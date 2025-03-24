export interface Song {
    id: number;
    artist: string;
    album: string;
    song: string;
    length: number;
    release_yr: number;
    genre: string;
    cover?: string;
    audioSrc: string;
}
 
export interface MusicPlayerProps {
    song: Song;
    songs: Song[];
    onSongChange: (newSong: Song) => void;  
  }
 
 