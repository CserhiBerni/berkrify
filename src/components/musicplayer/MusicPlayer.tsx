import React, { useState, useEffect, useRef } from "react";
import { MusicPlayerProps } from "../services/class/types";
import { FaPlay, FaPause, FaVolumeUp, FaStepBackward, FaStepForward, FaVolumeMute } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { ImLoop } from "react-icons/im";
import Slider from "@mui/material/Slider";
import "./MusicPlayer.css";

const MusicPlayer: React.FC<MusicPlayerProps> = ({ song, songs, onSongChange }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loop, setLoop] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isScrolling, setIsScrolling] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isSeeking = useRef(false);
    const titleRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("loadedmetadata", updateDuration);
        return () => {
            audio.removeEventListener("loadedmetadata", updateDuration);
        };
    }, [song]);

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
        setIsMuted(volume === 0);
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [song]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.src = song.audioSrc || "";
        audio.load();

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch((error) => console.warn("Song cannot be played:", error));
        }
    }, [song]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch((error) => console.warn("Song cannot be played:", error));
            }
        }
    };

    const formatTime = (time: number) =>
        `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, "0")}`;

    const handleVolumeChange = (e: Event, newValue: number | number[]) => {
        const vol = Array.isArray(newValue) ? newValue[0] : newValue;
        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol / 100;
    };

    const handleShuffle = () => {
        setShuffle((prev) => {
            if (!prev) setLoop(false);
            return !prev;
        });
    };

    const handleLoop = () => {
        setLoop((prevLoop) => {
            const newLoop = !prevLoop;
            if (audioRef.current) audioRef.current.loop = newLoop;
            if (newLoop) setShuffle(false);
            return newLoop;
        });
    };

    const handleSeek = (e: Event, newValue: number | number[]) => {
        const newTime = Array.isArray(newValue) ? newValue[0] : newValue;
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const startSeeking = () => {
        isSeeking.current = true;
    };

    const stopSeeking = () => {
        isSeeking.current = false;
    };

    const playNextSong = () => {
        if (loop) {
            audioRef.current!.currentTime = 0;
            audioRef.current!.play();
            return;
        }

        if (shuffle) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songs.length);
            } while (songs[randomIndex].id === song.id);

            onSongChange(songs[randomIndex]);
        } else {
            const currentIndex = songs.findIndex((s) => s.id === song.id);
            const nextIndex = (currentIndex + 1) % songs.length;
            onSongChange(songs[nextIndex]);
        }
    };

    const playPreviousSong = () => {
        const currentIndex = songs.findIndex((s) => s.id === song.id);

        if (shuffle) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songs.length);
            } while (songs[randomIndex].id === song.id);

            onSongChange(songs[randomIndex]);
        } else {
            const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
            onSongChange(songs[prevIndex]);
        }
    };

    return (
        <div className="music-player">
            <div className="player-content">
                <img src={song.cover || "/default-cover.jpg"} alt="cover" className="player-cover" />
                <div className="player-info">
                    <div ref={containerRef} className="marquee-container">
                        <div className={`marquee-content ${isScrolling ? "scrolling" : ""}`}>
                            <div ref={titleRef} className="song-title">{song.song}</div>
                            {isScrolling && <div className="song-title duplicate">{song.song}</div>}
                        </div>
                    </div>
                    <p className="artist-name">{song.artist}</p>
                </div>
            </div>

            <div className="player-controls">
                <span>{formatTime(currentTime)}</span>
                <Slider
                    min={0}
                    max={duration || 1}
                    value={currentTime}
                    onChange={handleSeek}
                    onMouseDown={startSeeking}
                    onMouseUp={stopSeeking}
                    className="seek-bar"
                    sx={{
                        width: '80%',
                        color: 'rgb(117, 86, 240)',
                        margin: '0 10px',
                        '& .MuiSlider-rail': {
                            backgroundColor: 'grey',
                        },
                        '& .MuiSlider-thumb': {
                            background: 'linear-gradient(90deg, purple, violet)',
                            borderRadius: '50%',
                            width: '14px',
                            height: '14px',
                            opacity: 0,
                            transition: 'opacity 0.2s, transform 0.2s',
                            transform: 'translateY(-50%) translateX(-25%)',
                            '&:hover': {
                                opacity: 1,
                                transform: 'scale(1) translateY(-50%) translateX(-25%)',
                            },
                            '&:active': {
                                opacity: 1,
                                transform: 'scale(1) translateY(-50%) translateX(-25%)',
                            },
                            '&:focus, &:active, &:hover, &.Mui-focusVisible': {
                                outline: 'none',
                                boxShadow: 'none',
                            },
                        },
                        '&:hover .MuiSlider-thumb': {
                            opacity: 1,
                        },
                        '@media (max-width: 600px)': {
                            '& .MuiSlider-thumb': {
                                opacity: 1,
                                transform: 'scale(1) translateY(-50%)',
                            },
                            '&:hover .MuiSlider-thumb': {
                                opacity: 1,
                            },
                        },
                    }}
                />
                <span>{formatTime(duration)}</span>
            </div>

            <div className="player-buttons-container">
                <div className="player-buttons">
                    <button onClick={playPreviousSong} className="control-btn">
                        <FaStepBackward />
                    </button>
                    <button onClick={handleShuffle} className={`control-btn ${shuffle ? "active" : ""}`}>
                        <FaShuffle />
                    </button>
                    <button onClick={togglePlay} className={`control-btn ${isPlaying ? "active" : ""}`}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={handleLoop} className={`control-btn ${loop ? "active" : ""}`}>
                        <ImLoop />
                    </button>
                    <button onClick={playNextSong} className="control-btn">
                        <FaStepForward />
                    </button>
                </div>
                <div className="volume-container">
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    <Slider
                        min={0}
                        max={100}
                        value={volume}
                        onChange={handleVolumeChange}
                        sx={{
                            width: 65,
                            color: 'rgb(117, 86, 240)',
                            margin: '0 10px',
                            '& .MuiSlider-rail': {
                                backgroundColor: 'grey',
                            },
                            '& .MuiSlider-thumb': {
                                background: 'linear-gradient(90deg, purple, violet)',
                                borderRadius: '50%',
                                width: '14px',
                                height: '14px',
                                opacity: 0,
                                transition: 'opacity 0.2s, transform 0.2s',
                                transform: 'translateY(-50%) translateX(-25%)',
                                '&:hover': {
                                    opacity: 1,
                                    transform: 'scale(1) translateY(-50%) translateX(-25%)',
                                },
                                '&:active': {
                                    opacity: 1,
                                    transform: 'scale(1) translateY(-50%) translateX(-25%)',
                                },
                                '&:focus, &:active, &:hover, &.Mui-focusVisible': {
                                    outline: 'none',
                                    boxShadow: 'none',
                                },
                            },
                            '&:hover .MuiSlider-thumb': {
                                opacity: 1,
                            },
                            '@media (max-width: 600px)': {
                                display: 'none',
                            },
                        }}
                    />
                </div>
            </div>

            <audio ref={audioRef} src={song.audioSrc || ""} onEnded={playNextSong} />
        </div>
    );
};

export default MusicPlayer;
