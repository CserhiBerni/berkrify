import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import './ProfilePage.css';
import { FaUser, FaEdit, FaCalendarAlt, FaEnvelope, FaSave, FaTimesCircle } from 'react-icons/fa';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  created: string;
  profilePicture?: string;
  role: 'Admin' | 'User';
}

const ProfilePage: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please log in to view your profile');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await axios.get(`${apiBaseUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setUpdatedName(response.data.name);

        setPreviewUrl(null);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        setError('Failed to load your profile. Please try again later.');

        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [apiBaseUrl, navigate]);

  const handleEditToggle = () => {
    if (editMode) {
      setUpdatedName(user?.name || '');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    setEditMode(!editMode);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authorization required');
        setLoading(false);
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('name', updatedName);

      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      const response = await axios.patch(
        `${apiBaseUrl}/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUser(response.data);
      setEditMode(false);
      setSelectedFile(null);
      setPreviewUrl(null);

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser) {
        storedUser.name = response.data.name;
        if (response.data.profilePicture) {
          storedUser.profilePicture = response.data.profilePicture;
        }
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-page-container">
        <Navbar onSearch={() => { }} />
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-page-container">
        <Navbar onSearch={() => { }} />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page-container">
        <Navbar onSearch={() => { }} />
        <div className="error-message">Profile not found</div>
      </div>
    );
  }

  const profilePicUrl = previewUrl ||
    (user.profilePicture ? `${apiBaseUrl}${user.profilePicture}` : null);

  return (
    <div className="profile-page-container">
      <Navbar onSearch={() => { }} />

      <div className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button
            className="edit-toggle-button"
            onClick={handleEditToggle}
          >
            {editMode ? <FaTimesCircle /> : <FaEdit />}
            <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="profile-card">
          <div
            className={`profile-picture-container ${editMode ? 'editable' : ''}`}
            onClick={handleProfilePictureClick}
          >
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <FaUser size={80} />
              </div>
            )}

            {editMode && (
              <div className="profile-picture-overlay">
                <FaEdit size={24} />
                <span>Change Picture</span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>

          <div className="profile-details">
            <div className="profile-field">
              <div className="field-label">
                <FaUser />
                <span>Name</span>
              </div>

              {editMode ? (
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="name-input"
                />
              ) : (
                <div className="field-value">{user.name}</div>
              )}
            </div>

            <div className="profile-field">
              <div className="field-label">
                <FaEnvelope />
                <span>Email</span>
              </div>
              <div className="field-value">{user.email}</div>
            </div>

            <div className="profile-field">
              <div className="field-label">
                <FaCalendarAlt />
                <span>Member Since</span>
              </div>
              <div className="field-value">
                {new Date(user.created).toLocaleDateString()}
              </div>
            </div>

            {user.role === 'Admin' && (
              <div className="profile-badge admin-badge">Admin</div>
            )}
          </div>
        </div>

        {editMode && (
          <div className="profile-actions">
            <button
              className="save-button"
              onClick={handleSaveChanges}
              disabled={loading}
            >
              <FaSave />
              <span>Save Changes</span>
            </button>
          </div>
        )}

        <div className="profile-actions">
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;