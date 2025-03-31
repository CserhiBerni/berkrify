import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import { uploadMp3, uploadCover } from "../services/service/uploadService";
import "./UploadForm.css";

const UploadForm: React.FC = () => {
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mp3Url, setMp3Url] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const handleMp3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMp3File(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mp3File && coverFile) {
      const mp3Url = await uploadMp3(mp3File);
      const coverUrl = await uploadCover(coverFile);

      if (mp3Url && coverUrl) {
        setMp3Url(mp3Url);
        setCoverUrl(coverUrl);
        alert("Files uploaded successfully");
      } else {
        alert("Failed to upload files");
      }
    } else {
      alert("Please select both MP3 and Cover files.");
    }
  };

  return (
    <div>
      <Navbar onSearch={() => {}} />
      <div className="upload-container">
        <div className="card p-4 shadow">
          <h1 className="text-center mb-1 text-uppercase text-secondary">
            Admin
          </h1>
          <h3 className="text-center mb-4">Upload MP3 and Cover</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">MP3 File:</label>
              <input
                type="file"
                className="form-control"
                onChange={handleMp3Change}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Cover Image:</label>
              <input
                type="file"
                className="form-control"
                onChange={handleCoverChange}
              />
            </div>
            <button type="submit" className="btn gradient-btn w-100">
              Upload Files
            </button>
          </form>

          {mp3Url && (
            <p className="mt-3">
              MP3 uploaded:{" "}
              <a href={mp3Url} target="_blank" rel="noopener noreferrer">
                {mp3Url}
              </a>
            </p>
          )}
          {coverUrl && (
            <p>
              Cover uploaded:{" "}
              <a href={coverUrl} target="_blank" rel="noopener noreferrer">
                {coverUrl}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
