
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/LandingPage.css";

import {
  FaUserCircle,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaInfoCircle,
  FaCompass,    
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

  return (
    <div className="landing-container">

      {/* ---------------- NAVBAR ---------------- */}
      <nav className="navbar">
  <div className="logo">CampusOrbit</div>

  <div className="nav-links">
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

    <button
      onClick={() => {
        const exploreSection = document.getElementById("explore");
        if (exploreSection) {
          exploreSection.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      <FaCompass /> Explore
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


      {/* ------------ HERO ------------ */}
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


      
      {/* ------------ DISCUSSION FORUM ------------ */}
      <section className="forum-section">
        <h2 className="forum-title">Discussion Forums</h2>
        <p className="forum-subtitle">Connect • Share • Explore</p>

        <div className="forum-row">
          <div className="forum-card" onClick={() => navigate("/forum?category=Part-Time Jobs")}>
            <span>💼</span>
            <p>Part-Time Jobs</p>
          </div>

          <div className="forum-card" onClick={() => navigate("/forum?category=Accommodation")}>
            <span>🏠</span>
            <p>Accommodation Tips</p>
          </div>

          <div className="forum-card" onClick={() => navigate("/forum?category=Transportation")}>
            <span>🚌</span>
            <p>Transportation</p>
          </div>

          <div className="forum-card" onClick={() => navigate("/forum?category=City Essentials")}>
            <span>🛠️</span>
            <p>City Essentials</p>
          </div>

          <div className="forum-card" onClick={() => navigate("/forum?category=Events")}>
            <span>🎉</span>
            <p>Events & Meetups</p>
          </div>

          <div className="forum-card" onClick={() => navigate("/forum?category=General Discussion")}>
            <span>💬</span>
            <p>General Discussion</p>
          </div>
        </div>

        <button className="view-all-btn" onClick={() => navigate("/forum")}>
          View All Forums →
        </button>
      </section>

      {/* ------------ ABOUT ------------ */}
      <section id="about" className="about-section">
        <h2>About CampusOrbit</h2>
        <p>
          CampusOrbit is built to support students who move to new cities. We help you find
          verified hostels, flats, part-time jobs, community support, and real emergency
          contacts — all in one trusted platform.
        </p>
        <p>
          Our vision is to make student life safer, smarter, and more connected.
          From accommodation to career growth, we bring everything closer to you.
        </p>
      </section>



      {/* ── EXPLORE HEADER ── */}
<section id="explore" className="explore-header">
  <div className="eh-blob1" /><div className="eh-blob2" /><div className="eh-blob3" />

  <div className="eh-inner">
    <div className="eh-pill">
      <span className="eh-pill-dot" />
      New City
    </div>

    <h2>New Chapter,<br /><em>New Adventure</em></h2>

    <p className="eh-sub">
      Don't just move to a city — <b>own it.</b><br />
      From hidden street food alleys and places to the best PGs near campus,<br />
      explore everything your new home has to offer.
    </p>

    <div className="eh-stats">
      <div className="eh-stat"><span className="eh-stat-num">7+</span><span className="eh-stat-lbl">Cities</span></div>
      <div className="eh-stat-div" />
      <div className="eh-stat"><span className="eh-stat-num">500+</span><span className="eh-stat-lbl">Listings</span></div>
      <div className="eh-stat-div" />
      <div className="eh-stat"><span className="eh-stat-num">10k+</span><span className="eh-stat-lbl">Students</span></div>
    </div>

    <div className="eh-arrow-row">
      <div className="eh-arrow-label">Choose your city</div>
      <div className="eh-chevrons">
        <div className="eh-chev" /><div className="eh-chev" /><div className="eh-chev" />
      </div>
    </div>
  </div>
</section>




     {/* 🌆 AUTO-SCROLLING CITIES SECTION */}
 <div className="cities-container">
  <h2 className="cities-title">Cities We Currently Serveing</h2>

  <div className="cities-scroll-wrapper">
    <div className="cities-scroll">

     {[...Array(2)].map((_, idx) => (
        <React.Fragment key={idx}>

          

          <div className="city-card" onClick={() => navigate("/explore?city=Delhi")}>
  <img src="/cities/delhi.jpg" className="city-image" alt="Delhi" />
  <p className="city-name">Delhi</p>
</div>

          <div className="city-card" onClick={() => navigate("/explore?city=Kolkata")}>
  <img src="/cities/kolkata.jpg" className="city-image" alt="Kolkata" />
  <p className="city-name">Kolkata</p>
</div>

          <div className="city-card" onClick={() => navigate("/explore?city=Mumbai")}>
  <img src="/cities/mumbai.jpg" className="city-image" alt="Mumbai" />
  <p className="city-name">Mumbai</p>
</div>

          <div className="city-card" onClick={() => navigate("/explore?city=Bangalore")}>
  <img src="/cities/bangalore.jpg" className="city-image" alt="Bangalore" />
  <p className="city-name">Bangalore</p>
</div>
         <div className="city-card" onClick={() => navigate("/explore?city=Hyderabad")}>
  <img src="/cities/hyderabad.jpg" className="city-image" alt="Hyderabad" />
  <p className="city-name">Hyderabad</p>
</div>

         <div className="city-card" onClick={() => navigate("/explore?city=Pune")}>
  <img src="/cities/pune.jpg" className="city-image" alt="Pune" />
  <p className="city-name">Pune</p>
</div>
          <div className="city-card" onClick={() => navigate("/explore?city=Chennai")}>
  <img src="/cities/chennai.jpg" className="city-image" alt="Chennai" />
  <p className="city-name">Chennai</p>
</div>

        </React.Fragment>
      ))}

    </div>
  </div>
</div>

      {/* ------------ CITY TICKER ------------ */}
      <section className="city-ticker">
        <div className="ticker-track">
          Linking learners from every corner. We’re bringing your student community closer.
        </div>
      </section>


      {/* ------------ WHY CHOOSE US ------------ */}
      <section className="choose-section">
        <h2>Why Choose Us?</h2>

        <div className="choose-grid">
          <div className="choose-card">
            <span>✔️</span>
            <h3>Verified Listings</h3>
            <p>Trusted hostels, PGs, jobs & contacts — verified for your safety.</p>
          </div>

          <div className="choose-card">
            <span>⚡</span>
            <h3>Fast Search</h3>
            <p>Find stays, jobs or help instantly with smart filters.</p>
          </div>

          <div className="choose-card">
            <span>🛡️</span>
            <h3>Safety First</h3>
            <p>Emergency contacts and safe-living guides available anytime.</p>
          </div>

          <div className="choose-card">
            <span>🤝</span>
            <h3>Community Driven</h3>
            <p>Join discussions and connect with students like you.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2025 CampusOrbit • Designed for Students, By Students 💫
      </footer>
    </div>
  );
}