

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

  useEffect(() => {
    const updateName = () => {
      const name = localStorage.getItem("userName");
      if (name) setUserName(name);
    };

    updateName();
    window.addEventListener("profile-updated", updateName);

    return () => window.removeEventListener("profile-updated", updateName);
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


      {/* ---------------- NAVBAR ---------------- */}
<nav className="navbar">
  <div className="logo">CampusOrbit</div>

  <div className="nav-links">
    {/* UPDATED ABOUT BUTTON */}
    <button
      onClick={() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
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

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        {userName && <h2 className="welcome-text">Hey {userName} 👋</h2>}
        <h1 className="hero-title">Find Your Perfect Stay 🎓</h1>
        <p className="hero-subtitle">
          Everything you need in a new city — stays, help & community 💫
        </p>

        <div className="cta-buttons">
          <button onClick={() => navigate("/rent")}>🏠 Find Accommodation</button>
          <button onClick={() => navigate("/EmergencyContacts")}>🚨 Emergency Help</button>
        </div>
      </section>

      

      {/* ---------------- FORUM PANEL ---------------- */}
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
{/* 


{/* ---------------- ABOUT SECTION ---------------- */}
      <section id="about" className="about-section">
        <h2>About CampusOrbit</h2>
        <p>
          CampusOrbit is a student-first platform designed to help you find accommodation,
          part-time jobs, emergency contacts, and community support — all in one place.
        </p>
        <p>
          Our mission is to make student life easier, safer, and smarter by giving you
          verified resources when moving to a new city.
        </p>
      </section>

{/* 🌆 AUTO-SCROLLING CITIES SECTION */}
<div className="cities-container">
  <h2 className="cities-title">Cities We Currently Serveing</h2>

  <div className="cities-scroll-wrapper">
    <div className="cities-scroll">

      {[...Array(2)].map((_, idx) => (
        <React.Fragment key={idx}>

          

          <div className="city-card">
  <img src="/cities/delhi.jpg" className="city-image" alt="Delhi" />
  <p className="city-name">Delhi</p>
</div>

          <div className="city-card">
  <img src="/cities/kolkata.jpg" className="city-image" alt="Kolkata" />
  <p className="city-name">Kolkata</p>
</div>

          <div className="city-card">
  <img src="/cities/mumbai.jpg" className="city-image" alt="Mumbai" />
  <p className="city-name">Mumbai</p>
</div>

          <div className="city-card">
  <img src="/cities/bangalore.jpg" className="city-image" alt="Bangalore" />
  <p className="city-name">Bangalore</p>
</div>
         <div className="city-card">
  <img src="/cities/hyderabad.jpg" className="city-image" alt="Hyderabad" />
  <p className="city-name">Hyderabad</p>
</div>

         <div className="city-card">
  <img src="/cities/pune.jpg" className="city-image" alt="Pune" />
  <p className="city-name">Pune</p>
</div>
          <div className="city-card">
  <img src="/cities/chennai.jpg" className="city-image" alt="Chennai" />
  <p className="city-name">Chennai</p>
</div>

        </React.Fragment>
      ))}

    </div>
  </div>
</div>

{/* ---------------- CITY TICKER ---------------- */}
      <section className="city-ticker">
        <div className="ticker-track">
           Linking learners from every corner. We’re bringing your student community closer.
        </div>
      </section>


      

      {/* ---------------- FOOTER ---------------- */}
      <footer className="footer">
        © 2025 CampusOrbit • Designed for Students, By Students 💫
      </footer>

    </div>
  );
}