

import React, { useState, useEffect } from "react";
import "../style/MyProfile.css";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    instagram: "",
    linkedin: "",
    about: "",
    profilePic: "",
  });

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (storedProfile) setProfile(storedProfile);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setProfile((prev) => ({ ...prev, profilePic: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfile((prev) => ({ ...prev, profilePic: "" }));
  };

  

  const handleSave = () => {
  localStorage.setItem("userProfile", JSON.stringify(profile));

  // 🔥 IMPORTANT: update navbar name also
  localStorage.setItem("userName", profile.name);

  // 🔥 Notify other pages (Landing) instantly
  window.dispatchEvent(new Event("profile-updated"));

  alert("Profile updated successfully!");
};

  return (
    <div className="profile-container">
      <button className="back-btn" onClick={() => navigate("/landing")}>
        ← Back
      </button>

      <div className="profile-card">
        <h2>👤 My Profile</h2>

        {/* Profile Picture */}
        <div className="profile-pic-section">
          <label htmlFor="profilePic">
            {profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile" className="profile-pic" />
            ) : (
              <div className="placeholder-pic">📷 Add Photo</div>
            )}
          </label>

          {editMode && (
            <div className="pic-actions">
              <label htmlFor="profilePic" className="upload-btn">
                Upload
              </label>
              {profile.profilePic && (
                <button onClick={removeImage} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          )}

          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </div>

        {/* Fields */}
        <div className="input-group">
          <label>👤 Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="input-group">
          <label>📧 Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className="input-group">
          <label>📝 About</label>
          <textarea
            name="about"
            value={profile.about}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Tell something about yourself..."
          />
        </div>

        <div className="input-group">
          <label>📸 Instagram (Optional)</label>
          <input
            type="text"
            name="instagram"
            value={profile.instagram}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="input-group">
          <label>💼 LinkedIn (Optional)</label>
          <input
            type="text"
            name="linkedin"
            value={profile.linkedin}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        

        {/* Buttons */}
        <div className="btn-group">
          {editMode ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                💾 Save
              </button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>
                ❌ Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}