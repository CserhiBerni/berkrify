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
    path?: string;
}
 
export interface MusicPlayerProps {
    song: Song;
    songs: Song[];
    onSongChange: (song: Song) => void;
    onPlayNext?: () => void;
    onPlayPrevious?: () => void;
  }
 