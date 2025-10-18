import React, { useState, useEffect } from "react";
import "../style/MyProfile.css";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    instagram: "",
    linkedin: "",
    profilePic: "",
  });

  useEffect(() => {
    // Load from localStorage if available
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
      reader.onload = () => setProfile((prev) => ({ ...prev, profilePic: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile updated successfully!");
  };

  const goBack = () => {
    navigate("/landing");
  };

  return (
    <div className="profile-container">
      <button className="back-btn" onClick={goBack}>← Back</button>
      <div className="profile-card">
        <h2>My Profile 👤</h2>

        <div className="profile-pic-section">
          <label htmlFor="profilePic">
            {profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile" className="profile-pic" />
            ) : (
              <div className="placeholder-pic">Add Photo</div>
            )}
          </label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="input-group">
          <label>User Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label>Instagram(optional)</label>
          <input
            type="text"
            name="instagram"
            value={profile.instagram}
            onChange={handleChange}
            placeholder="Add your Instagram handle"
          />
        </div>

        <div className="input-group">
          <label>LinkedIn(optional)</label>
          <input
            type="text"
            name="linkedin"
            value={profile.linkedin}
            onChange={handleChange}
            placeholder="Add your LinkedIn profile"
          />
        </div>

        <button className="save-btn" onClick={handleSave}>💾 Save Changes</button>
      </div>
    </div>
  );
}
