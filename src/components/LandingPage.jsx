
// import React from "react";                             1st one
// import { useNavigate } from "react-router-dom";
// import "../style/LandingPage.css";

// export default function LandingPage() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("ownerId");
//     localStorage.removeItem("ownerName");
//     navigate("/register");
//   };

//   const goToProfile = () => {
//     navigate("/MyProfile");
//   };

//   return (
//     <div className="landing-page">
//       {/* My Profile Button (Top Right Corner) */}
//       <div className="top-right">
//         <button className="corner-btn" onClick={goToProfile}>👤 My Profile</button>
//       </div>

//       <header className="header">
//   <h1 className="app-title">Welcome to CityEase ✨</h1>
//   <p className="tagline">
//     Your one-stop hub for student living — find stays, jobs, and quick help near you!
//   </p>
// </header>



//       <div className="action-buttons">
//         <button className="btn accommodation-btn" onClick={() => navigate("/rent")}>
//           🏠 Find Accommodation
//         </button>
//         <button className="btn job-btn" onClick={() => navigate("/ParttimeJob")}>
//           💼 Find Part-Time Job
//         </button>
//         <button className="btn emergency-btn" onClick={() => navigate("/EmergencyContacts")}>
//           🚨 Emergency Contacts
//         </button>
//       </div>

//       <footer className="footer">
//         <p>© 2025 CityEase • Designed for students across India 🇮🇳</p>
//       </footer>

//       {/* Logout Button (Bottom Right Corner) */}
//       <button className="corner-btn logout-btn" onClick={handleLogout}>
//         🚪 Logout
//       </button>
//     </div>
//   );
// }



// ---------------------------------------------final-------------------------------------------------------------------------

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../style/LandingPage.css";

// export default function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="landing-container">
//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="logo">CampusOrbit</div>
//         <div className="nav-links">
//           <button onClick={() => navigate("/login")} className="nav-btn">Login</button>
//           <button onClick={() => navigate("/register")} className="nav-btn">Register</button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <header className="hero-section">
//         <div className="overlay">
//           <h1 className="hero-title">Find Your Perfect Student Stay</h1>
//           <p className="hero-subtitle">
//             Explore verified accommodations, part-time jobs, and essentials — all in one orbit.
//           </p>

//           {/* Search Bar */}
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search by City, University or Property"
//               className="search-input"
//             />
//             <button className="search-btn">🔍</button>
//           </div>

//           {/* Quick Features */}
//           <div className="features">
//             <div className="feature">
//               <span>🏠</span>
//               <p>Verified Listings</p>
//             </div>
//             <div className="feature">
//               <span>⏰</span>
//               <p>24×7 Assistance</p>
//             </div>
//             <div className="feature">
//               <span>💰</span>
//               <p>Affordable Options</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Info Section */}
//       <section className="info-section">
//         <div className="info-card">
//           <h2>1K+</h2>
//           <p>Available Stays</p>
//         </div>
//         <div className="info-card">
//           <h2>500+</h2>
//           <p>Universities Covered</p>
//         </div>
//         <div className="info-card">
//           <h2>100+</h2>
//           <p>Cities Across India</p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         © 2025 CampusOrbit • Empowering Student Living
//       </footer>
//     </div>
//   );
// }

//-----------------------------------pink palette----------------------------------------------------------

import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/LandingPage.css";
import { FaUserCircle, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaInfoCircle } from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">CampusOrbit</div>
        <div className="nav-links">
          {/* Always show About */}
          <button className="nav-btn" onClick={() => navigate("/About")}>
            <FaInfoCircle className="icon" /> About
          </button>

          {/* If user logged in */}
          {token ? (
            <>
              <button className="nav-btn" onClick={() => navigate("/MyProfile")}>
                <FaUserCircle className="icon" /> Profile
              </button>
              <button className="nav-btn" onClick={handleLogout}>
                <FaSignOutAlt className="icon" /> Logout
              </button>
            </>
          ) : (
            /* If user NOT logged in */
            <>
              <button className="nav-btn" onClick={() => navigate("/register")}>
                <FaUserPlus className="icon" /> Register
              </button>
              <button className="nav-btn" onClick={() => navigate("/login")}>
                <FaSignInAlt className="icon" /> Login
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Find Your Perfect Stay 🎓</h1>
        <p className="hero-subtitle">
          Smart, simple, and student-friendly — explore stays, part-time jobs, and campus life with ease!
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by city, university, or property"
          />
          <button>🔍</button>
        </div>

        <div className="cta-buttons">
          <button onClick={() => navigate("/rent")} style={{ fontWeight: "bold" }}>
            🏠 Find Accommodation
          </button>
          <button onClick={() => navigate("/ParttimeJob")} style={{ fontWeight: "bold" }}>
            💼 Find Jobs
          </button>
          <button
            className="btn emergency-btn"
            onClick={() => navigate("/EmergencyContacts")}
          >
            🚨 Emergency Contacts
          </button>
        </div>
      </section>

      <footer className="footer">
        © 2025 CampusOrbit • Designed for Students, by Students 💫
      </footer>
    </div>
  );
}


