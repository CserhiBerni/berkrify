import axios from "axios";

const API_URL = "http://localhost:3000/songs";

export const uploadMp3 = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload/mp3`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
    const response = await axios.post(`${API_URL}/upload/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data.url;
  } catch (error) {
    console.error('Error uploading cover image:', error);
    return null;
  }
};
