import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const uploadMp3 = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/songs/upload/mp3`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.url;
  } catch (error) {
    console.error('Error uploading MP3:', error);
    return null;
  }
};

export const uploadCover = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/songs/upload/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.url;
  } catch (error) {
    console.error('Error uploading cover image:', error);
    return null;
  }
};

export const uploadPlaylistCover = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const response = await axios.post(`${API_URL}/playlists/upload/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Playlist cover upload response:', response.data);
    return response.data.url;
  } catch (error) {
    console.error('Error uploading playlist cover image:', error);
    throw error;
  }
};