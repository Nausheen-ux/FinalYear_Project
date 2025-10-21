
import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("ownerId");
    localStorage.removeItem("ownerName");
    navigate("/register");
  };

  const goToProfile = () => {
    navigate("/MyProfile");
  };

  return (
    <div className="landing-page">
      {/* My Profile Button (Top Right Corner) */}
      <div className="top-right">
        <button className="corner-btn" onClick={goToProfile}>👤 My Profile</button>
      </div>

      <header className="header">
  <h1 className="app-title">Welcome to CityEase ✨</h1>
  <p className="tagline">
    Your one-stop hub for student living — find stays, jobs, and quick help near you!
  </p>
</header>



      <div className="action-buttons">
        <button className="btn accommodation-btn" onClick={() => navigate("/rent")}>
          🏠 Find Accommodation
        </button>
        <button className="btn job-btn" onClick={() => navigate("/ParttimeJob")}>
          💼 Find Part-Time Job
        </button>
        <button className="btn emergency-btn" onClick={() => navigate("/EmergencyContacts")}>
          🚨 Emergency Contacts
        </button>
      </div>

      <footer className="footer">
        <p>© 2025 CityEase • Designed for students across India 🇮🇳</p>
      </footer>

      {/* Logout Button (Bottom Right Corner) */}
      <button className="corner-btn logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}
