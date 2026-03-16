

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/RentPage.css";


/* Rent preference form: rentRange, sharing, location, accommodationType, gender */
export default function RentPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    rentRange: "",
    sharing: "",
    location: "",
    accommodationType: "",
    genderPreference: "Any",
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    // store preferences to localStorage (simple)
    localStorage.setItem("rentPreferences", JSON.stringify(form));
    // go to rent results
    nav("/rent-results");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Search Accommodation</h2></div>

        <form onSubmit={submit}>
          <div className="form-row">
            <label>Rent Range</label>
            <select name="rentRange" value={form.rentRange} onChange={change} className="input" required>
              <option value="">Select rent range</option>
              <option value="below5k">Below ₹5,000</option>
              <option value="5k-10k">₹5,000 - ₹10,000</option>
              <option value="10k-20k">₹10,000 - ₹20,000</option>
              <option value="above20k">Above ₹20,000</option>
            </select>
          </div>

          <div className="grid">
            <div>
              <label>Sharing / Single</label>
              <select name="sharing" value={form.sharing} onChange={change} className="input" required>
                <option value="">Select</option>
                <option value="single">Single</option>
                <option value="double">Double sharing</option>
                <option value="triple">Triple sharing</option>
              </select>
            </div>

            <div>
              <label>Accommodation Type</label>
              <select name="accommodationType" value={form.accommodationType} onChange={change} className="input" required>
                <option value="">Select type</option>
                <option value="PG">PG</option>
                <option value="Flat">Flat</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>Preferred Location (city/area)</label>
            <input name="location" value={form.location} onChange={change} className="input" placeholder="e.g., Saltlake, Kolkata" required/>
          </div>

          <div className="form-row">
            <label>Gender Preference</label>
            <select name="genderPreference" value={form.genderPreference} onChange={change} className="input">
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" type="submit">Search</button>
            <button className="btn btn-ghost" type="button" onClick={() => nav("/landing")}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
