
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/LandingPage.css";
import {
  FaUserCircle,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaInfoCircle,
  FaTools,
  FaHotel,
  FaUsers,
  FaComments,
  FaBriefcase,
  FaCalendarAlt
} from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userName, setUserName] = useState("");

  // useEffect(() => {
  //   const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
  //   if (storedProfile?.name) {
  //     setUserName(storedProfile.name);
  //   }
  // }, []);

//   useEffect(() => {
//   const name = localStorage.getItem("userName");
//   if (name) {
//     setUserName(name);
//   }
// }, []);

useEffect(() => {
  const updateName = () => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  };

  updateName(); // initial load

  // 🔥 Listen for profile updates
  window.addEventListener("profile-updated", updateName);

  return () => {
    window.removeEventListener("profile-updated", updateName);
  };
}, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navigateToForum = (category) => {
    navigate(`/forum?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="landing-container">

      {/* Forum Panel */}
      <div className="forum-container">
        <h2 className="forum-title" onClick={() => navigate("/forum")}>
          📢 Discussion Forum
        </h2>

        <div className="forum-list">
          <div className="forum-item" onClick={() => navigateToForum("Part-Time Jobs")}>
            <FaBriefcase /> Part-Time Jobs
          </div>

          <div className="forum-item" onClick={() => navigateToForum("Cafes & Restaurants")}>
            <FaHotel /> Cafés & Restaurants
          </div>

          <div className="forum-item" onClick={() => navigateToForum("Events & Meetups")}>
            <FaCalendarAlt /> Events & Meetups
          </div>

          <div className="forum-item" onClick={() => navigateToForum("City Services")}>
            <FaTools /> City Services
          </div>

          <div className="forum-item" onClick={() => navigateToForum("Accommodation Tips")}>
            <FaUsers /> Accommodation Tips
          </div>

          <div className="forum-item" onClick={() => navigateToForum("General Discussion")}>
            <FaComments /> General Chat
          </div>

          <div className="forum-item" onClick={() => navigateToForum("Study Group")}>
            <FaComments /> Study Group
          </div>

          <div className="forum-item" onClick={() => navigateToForum("Roommate Finder")}>
            <FaComments /> Roommate Finder
          </div>

          <div className="forum-item forum-view-all" onClick={() => navigate("/forum")}>
            📋 View All Posts
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">CampusOrbit</div>

        <div className="nav-links">
          <button onClick={() => navigate("/About")}>
            <FaInfoCircle /> About
          </button>

          {token ? (
            <>
              <button onClick={() => navigate("/MyProfile")}>
                <FaUserCircle /> {userName || "Profile"}
              </button>

              <button onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/register")}>
                <FaUserPlus /> Register
              </button>

              <button onClick={() => navigate("/login")}>
                <FaSignInAlt /> Login
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">

        {userName && (
          <h2 className="welcome-text">Hey {userName} 👋</h2>
        )}

        <h1 className="hero-title">Find Your Perfect Stay 🎓</h1>

        <p className="hero-subtitle">
          Everything you need in a new city — stays, help & community 💫
        </p>

        <div className="cta-buttons">

          {/* ✅ Find Jobs REMOVED */}
          <button onClick={() => navigate("/rent")}>
            🏠 Find Accommodation
          </button>

          <button onClick={() => navigate("/EmergencyContacts")}>
            🚨 Emergency Help
          </button>

        </div>

      </section>

      <footer className="footer">
        © 2025 CampusOrbit • Designed for Students 💫
      </footer>
    </div>
  );
}