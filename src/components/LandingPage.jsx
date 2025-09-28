
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage({ user, onLogout }) {
  const nav = useNavigate();
  const name = user?.name || localStorage.getItem("loggedInUser")?.name || "User";

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>Welcome, {name}</h2>
          <div>
            <button className="btn btn-ghost" onClick={() => { onLogout && onLogout(); nav("/login"); }}>Logout</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <h3>🏡 Accommodation</h3>
            <p className="note">Find PGs, flats or hostels filtered by your preferences.</p>
            <button className="btn btn-primary" onClick={() => nav("/rent")}>Search Accommodation</button>
          </div>

          <div style={{ flex: 1 }}>
            <h3>💼 Part-time Jobs</h3>
            <p className="note">Search part-time roles that fit your schedule and skills.</p>
            <button className="btn btn-primary" onClick={() => nav("/parttimejob")}>Find Part-time Jobs</button>
          </div>
        </div>
      </div>
    </div>
  );
}

