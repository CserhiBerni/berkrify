import React, { useEffect, useRef, useState } from "react";
import { Song } from "../services/class/types";
import { FaPlay } from "react-icons/fa";
import "./MusicCard.css";
 
interface MusicCardProps {
    song: Song;
    onPlay: () => void;
}
 
const MusicCard: React.FC<MusicCardProps> = ({ song, onPlay }) => {
    const titleRef = useRef<HTMLDivElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const artistRef = useRef<HTMLDivElement>(null);
    const artistContainerRef = useRef<HTMLDivElement>(null);
 
    const [isTitleScrollable, setIsTitleScrollable] = useState(false);
    const [isArtistScrollable, setIsArtistScrollable] = useState(false);
    const [averageColor, setAverageColor] = useState("rgba(0, 0, 0, 0.5)");
 
    useEffect(() => {
        if (titleRef.current && titleContainerRef.current) {
            setIsTitleScrollable(titleRef.current.scrollWidth > titleContainerRef.current.clientWidth);
        }
        if (artistRef.current && artistContainerRef.current) {
            setIsArtistScrollable(artistRef.current.scrollWidth > artistContainerRef.current.clientWidth);
        }
    }, [song.song, song.artist]);
 
    useEffect(() => {
        if (song.cover) {
            const coverImg = new Image();
            coverImg.crossOrigin = "Anonymous";
            coverImg.src = song.cover;
 
            coverImg.onload = () => {
                const rgb = getAverageRGB(coverImg);
                setAverageColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
            };
        }
    }, [song.cover]);
 
    function getAverageRGB(imgEl: HTMLImageElement) {
        const blockSize = 5;
        const defaultRGB = { r: 0, g: 0, b: 0 };
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
 
        if (!context) {
            return defaultRGB;
        }
 
        canvas.width = imgEl.naturalWidth;
        canvas.height = imgEl.naturalHeight;
        context.drawImage(imgEl, 0, 0);
 
        try {
            const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
            let i = 0, r = 0, g = 0, b = 0, count = 0;
 
            while ((i += blockSize * 4) < data.length) {
                count++;
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }
 
            return { r: ~~(r / count), g: ~~(g / count), b: ~~(b / count) };
        } catch (e) {
            console.error("Error extracting RGB:", e);
            return defaultRGB;
        }        
    }
 
    return (
        <div
            className="music-card"
            onClick={onPlay}
            style={{
                background: `linear-gradient(to bottom, transparent, ${averageColor})`
            }}
        >
            <div className="cover-container">
                <img src={song.cover ?? "/default-cover.jpg"} alt={`${song.album} cover`} className="music-cover" />
                <div className="overlay">
                    <FaPlay className="play-icon" />
                </div>
            </div>
            <div className="music-card-body">
                <div className="scroll-container" ref={titleContainerRef}>
                    <div className={`scroll-text ${isTitleScrollable ? "scrollable" : ""}`} ref={titleRef}>
                        <h5>{song.song}</h5>
                    </div>
                </div>
 
                <div className="scroll-container" ref={artistContainerRef}>
                    <div className={`scroll-text ${isArtistScrollable ? "scrollable" : ""}`} ref={artistRef}>
                        <p>{song.artist}</p>
                    </div>
                </div>
 
                <p><small>{song.album} ({song.release_yr})</small></p>
                <p>{song.genre}</p>
                <p>{Math.floor(song.length / 60)}:{(song.length % 60).toString().padStart(2, "0")}</p>
            </div>
        </div>
    );
};
 
export default MusicCard;
 