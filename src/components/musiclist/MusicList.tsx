import { useEffect, useState, useRef } from "react";
import { getSongs } from "../services/service/songService";
import { Song } from "../services/class/types";
import MusicCard from "../musiccard/MusicCard";
import "./MusicList.css";

const NUM_ROWS = 4;

const MusicList: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [showScrollButtons, setShowScrollButtons] = useState<boolean[]>([]);

    useEffect(() => {
        const fetchSongs = async () => {
            const data = await getSongs();
            setSongs(data);
        };

        fetchSongs();
    }, []);

    const groupedSongs = Array.from({ length: NUM_ROWS }, () => [] as Song[]);
    songs.forEach((song, index) => {
        groupedSongs[index % NUM_ROWS].push(song);
    });

    const handleScroll = (rowIndex: number) => {
        const container = scrollRefs.current[rowIndex];
        if (!container) return;

        setShowScrollButtons((prev) => {
            const newState = [...prev];
            newState[rowIndex] = container.scrollLeft > 20;
            return newState;
        });
    };

    useEffect(() => {
        const enableDragScroll = (container: HTMLDivElement | null) => {
            if (!container) return;

            let isDown = false;
            let startX: number;
            let scrollLeft: number;

            container.addEventListener("mousedown", (e) => {
                isDown = true;
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
                container.classList.add("grabbing");
            });

            container.addEventListener("mouseleave", () => {
                isDown = false;
                container.classList.remove("grabbing");
            });

            container.addEventListener("mouseup", () => {
                isDown = false;
                container.classList.remove("grabbing");
            });

            container.addEventListener("mousemove", (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });
        };

        scrollRefs.current.forEach(enableDragScroll);
    }, [songs.length]);

    const scrollToStart = (rowIndex: number) => {
        if (scrollRefs.current[rowIndex]) {
            scrollRefs.current[rowIndex]?.scrollTo({ left: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="music-list-wrapper">
            {groupedSongs.map((rowSongs, rowIndex) => (
                <div key={rowIndex} className="music-row">
                    <div
                        className="music-list-container"
                        ref={(el) => {
                            scrollRefs.current[rowIndex] = el;
                        }}
                        onScroll={() => handleScroll(rowIndex)}
                    >
                        <div className="music-list">
                            {rowSongs.map((song) => (
                                <MusicCard key={song.id} song={song} />
                            ))}
                            <div className="music-list-end-space"></div>
                        </div>
                    </div>

                    {showScrollButtons[rowIndex] && (
                        <button className="scroll-to-start-btn show" onClick={() => scrollToStart(rowIndex)}>
                            <svg className="scroll-icon" width="50" height="50" viewBox="0 0 24 24" fill="black">
                                <defs>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="purple" />
                                        <stop offset="100%" stopColor="orange" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15l-5-5 5-5v10z"
                                    className="arrow-path"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MusicList;