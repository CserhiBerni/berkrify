import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMusic } from "react-icons/fa";
import { MdPhotoCamera } from "react-icons/md";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { uploadPlaylistCover } from "../../components/services/service/uploadService"; // Import the new service
import "./CreatePlaylist.css";

interface PlaylistData {
  name: string;
  description: string;
  coverImage: File | null;
}

const CreatePlaylist: React.FC = () => {
  const [playlistData, setPlaylistData] = useState<PlaylistData>({
    name: "",
    description: "",
    coverImage: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    console.log("API URL:", import.meta.env.VITE_API_URL || "Not defined");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlaylistData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      setPlaylistData((prev) => ({
        ...prev,
        coverImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const trimmedName = playlistData.name.trim();
    if (!trimmedName) {
      setError("Please enter a playlist title");
      setIsLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to create playlists");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      const playlistCreateData: any = {
        name: trimmedName,
        description: playlistData.description || ""
      };

      if (playlistData.coverImage) {
        try {
          const coverImagePath = await uploadPlaylistCover(playlistData.coverImage);
          if (coverImagePath) {
            playlistCreateData.coverImagePath = coverImagePath;
          }
        } catch (uploadError) {
          console.error("Error uploading cover image:", uploadError);
        }
      }

      console.log("Sending playlist data:", playlistCreateData);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await axios.post(
        `${apiUrl}/playlists`, 
        playlistCreateData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      
      console.log('Playlist created:', response.data);
      navigate(`/playlist/${response.data.id || response.data.playlistId}`);
    } catch (err) {
      console.error("Error creating playlist:", err);
      
      if (axios.isAxiosError(err)) {
        console.log("Response data:", err.response?.data);
        console.log("Status code:", err.response?.status);
        
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response?.status === 404) {
          setError("API endpoint not found. Please check your application configuration.");
        } else {
          setError(err.response?.data?.message || "Failed to create playlist");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchDummy = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <div className="create-playlist-container">
      <Navbar onSearch={handleSearchDummy} />
      
      <div className="create-playlist-content">
        <div className="create-playlist-header">
          <h1>Create New Playlist</h1>
          <p>Express yourself by creating a custom playlist with your favorite tracks.</p>
        </div>
        
        <div className="create-playlist-form-container">
          <form onSubmit={handleSubmit} className="create-playlist-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group cover-upload-container">
              <div 
                className="cover-preview" 
                onClick={() => document.getElementById("coverImageInput")?.click()}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Playlist cover preview" className="cover-image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <MdPhotoCamera className="upload-icon" />
                    <p>Upload Cover Image</p>
                    <span className="upload-hint">Click to browse or drag an image here</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="coverImageInput"
                accept="image/*"
                onChange={handleImageChange}
                className="visually-hidden"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">
                <FaMusic className="form-icon" /> 
                Playlist Title *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={playlistData.name}
                onChange={handleChange}
                placeholder="My Awesome Playlist"
                maxLength={100}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={playlistData.description}
                onChange={handleChange}
                placeholder="Tell us what makes this playlist special..."
                maxLength={500}
                rows={4}
              />
              <span className="char-count">
                {playlistData.description.length}/500
              </span>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="create-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <FaPlus className="button-icon" /> 
                    Create Playlist
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;