import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Import CSS


export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome to Student Help Portal 🏡</h1>
        <p className="home-subtitle">
          Find or Post Accommodations Easily for Students
        </p>
        <div className="home-buttons">
          <button className="btn btn-register" onClick={() => navigate("/register")}>
            Register
          </button>
          <button className="btn btn-login" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
