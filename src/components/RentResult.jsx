import React from "react";
import { useNavigate } from "react-router-dom";

/* Simple sample list and filtering based on saved preferences */
const SAMPLE_ACCOMMODATIONS = [
  { id: 1, title: "Cozy Single PG - Koramangala", rentCategory: "5k-10k", sharing: "single", type: "PG", location: "Koramangala", gender: "Any", phone: "987650001" },
  { id: 2, title: "Shared Flat - Near MG Road", rentCategory: "10k-20k", sharing: "double", type: "Flat", location: "MG Road", gender: "Male", phone: "987650002" },
  { id: 3, title: "Girls Hostel - Jayanagar", rentCategory: "below5k", sharing: "triple", type: "Hostel", location: "Jayanagar", gender: "Female", phone: "987650003" },
  { id: 4, title: "Premium 1BHK - Indiranagar", rentCategory: "above20k", sharing: "single", type: "Flat", location: "Indiranagar", gender: "Any", phone: "987650004" },
];

export default function RentResults() {
  const nav = useNavigate();
  const raw = localStorage.getItem("rentPreferences");
  if (!raw) {
    return (
      <div className="container">
        <div className="card">
          <h2>No preferences submitted</h2>
          <p>Please search for accommodation first.</p>
          <button className="btn btn-ghost" onClick={() => nav("/rent")}>Go to Search</button>
        </div>
      </div>
    );
  }
  const prefs = JSON.parse(raw);

 
  const matches = SAMPLE_ACCOMMODATIONS.filter((a) => {
    if (prefs.rentRange && prefs.rentRange !== "" && prefs.rentRange !== a.rentCategory) {
     
    }
    
    if (prefs.location && prefs.location.trim()) {
      const loc = prefs.location.toLowerCase();
      if (!a.location.toLowerCase().includes(loc)) {
        
      }
    }
    // gender preference
    if (prefs.genderPreference && prefs.genderPreference !== "Any" && a.gender !== "Any" && a.gender !== prefs.genderPreference) {
      return false;
    }
    // sharing
    if (prefs.sharing && prefs.sharing !== "" && prefs.sharing !== a.sharing && !(prefs.sharing === "single" && a.sharing === "single")) {
      // allow single matches
    }
    // type
    if (prefs.accommodationType && prefs.accommodationType !== "" && prefs.accommodationType !== a.type) {
      return false;
    }
    return true;
  });

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Accommodation Results</h2></div>
        <p className="note">Results based on your preferences:</p>

        <div style={{ marginTop: 12 }}>
          <strong>Your Preferences:</strong>
          <ul>
            <li>Rent: {prefs.rentRange}</li>
            <li>Sharing: {prefs.sharing}</li>
            <li>Type: {prefs.accommodationType}</li>
            <li>Location: {prefs.location}</li>
            <li>Gender: {prefs.genderPreference}</li>
          </ul>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Matches:</strong>
          <div className="card-list">
            {matches.length === 0 && <div>No exact matches found — showing nearby results</div>}
            {(matches.length ? matches : SAMPLE_ACCOMMODATIONS).map((m) => (
              <div key={m.id} className="card-item">
                <strong>{m.title}</strong>
                <div className="note">Type: {m.type} · Sharing: {m.sharing}</div>
                <div className="note">Location: {m.location}</div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 700 }}>Contact</div>
                  <div className="note">Owner: {m.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => nav("/rent")}>Edit Preferences</button>
          <button className="btn btn-primary" onClick={() => nav("/landing")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
