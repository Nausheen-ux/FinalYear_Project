import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/RentPage.css";

export default function RentPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    rentRange: "",
    sharing: "",
    location: "",
    locality: "",
    accommodationType: "",
    genderPreference: "Any",
    college: "",
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    localStorage.setItem("rentPreferences", JSON.stringify(form));

    const studentId = localStorage.getItem("userId");
    if (studentId) {
      try {
        await axios.post("http://localhost:5000/api/search-history", {
          studentId,
          ...form,
        });
      } catch (err) {
        console.warn("Could not save search history:", err.message);
      }
    }

    nav("/rent-results");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Search Accommodation</h2></div>

        <form onSubmit={submit}>
          <div className="form-row">
            <label>Rent Range</label>
            <select name="rentRange" value={form.rentRange} onChange={change} className="input">
              <option value="">Any</option>
              <option value="below5k">Below ₹5,000</option>
              <option value="5k-10k">₹5,000 - ₹10,000</option>
              <option value="10k-20k">₹10,000 - ₹20,000</option>
              <option value="above20k">Above ₹20,000</option>
            </select>
          </div>

          <div className="grid">
            <div>
              <label>Sharing / Single</label>
              <select name="sharing" value={form.sharing} onChange={change} className="input">
                <option value="">Any</option>
                <option value="single">Single</option>
                <option value="double">Double sharing</option>
                <option value="triple">Triple sharing</option>
              </select>
            </div>

            <div>
              <label>Accommodation Type</label>
              <select name="accommodationType" value={form.accommodationType} onChange={change} className="input">
                <option value="">Any</option>
                <option value="PG">PG</option>
                <option value="Flat">Flat</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>
              City / Area <span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="location"
              value={form.location}
              onChange={change}
              className="input"
              placeholder="e.g., Kolkata"
              required
            />
          </div>

          <div className="form-row">
            <label>
              Locality{" "}
              <span style={{ fontWeight: 400, color: "#888", fontSize: "0.85em" }}>(optional)</span>
            </label>
            <input
              name="locality"
              value={form.locality}
              onChange={change}
              className="input"
              placeholder="e.g., Salt Lake, Kalikapur"
            />
          </div>

          <div className="form-row">
            <label>
              Nearby College / University{" "}
              <span style={{ fontWeight: 400, color: "#888", fontSize: "0.85em" }}>(optional)</span>
            </label>
            <input
              name="college"
              value={form.college}
              onChange={change}
              className="input"
              placeholder="e.g., Jadavpur University"
            />
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
