import React from "react";
import { useNavigate } from "react-router-dom";

/* simple sample jobs data */
const SAMPLE_JOBS = [
  { id: 1, role: "Tutor / Teaching Assistant", location: "Koramangala", time: "5pm-8pm", salary: 12000, description: "Private tuition for 10th grade" },
  { id: 2, role: "Delivery Rider / Delivery Partner", location: "Indiranagar", time: "6pm-10pm", salary: 15000, description: "Food delivery (part-time)" },
  { id: 3, role: "Barista / Cafe Staff", location: "MG Road", time: "8am-12pm", salary: 9000, description: "Morning shift cafe staff" },
  { id: 4, role: "Data Entry / Backoffice", location: "Remote", time: "Flexible", salary: 10000, description: "Work from home - data entry" },
  { id: 5, role: "Event Staff / Helper", location: "Bangalore", time: "Evenings & Weekends", salary: 7000, description: "Event setup & guest help" },
];

export default function JobResults() {
  const nav = useNavigate();
  const raw = localStorage.getItem("jobPreferences");
  if (!raw) {
    return (
      <div className="container">
        <div className="card">
          <h2>No preferences submitted</h2>
          <p>Please submit your job preferences first.</p>
          <button className="btn btn-ghost" onClick={() => nav("/parttime")}>Go to Job Form</button>
        </div>
      </div>
    );
  }

  const prefs = JSON.parse(raw);

  // filter matching jobs (very simple)
  const matches = SAMPLE_JOBS.filter((j) => {
    // role
    if (prefs.preferredJobRole && prefs.preferredJobRole !== "" && !j.role.toLowerCase().includes(prefs.preferredJobRole.toLowerCase())) return false;
    // location
    if (prefs.preferredLocation && prefs.preferredLocation.trim() !== "") {
      const loc = prefs.preferredLocation.toLowerCase();
      if (j.location.toLowerCase() !== "remote" && !j.location.toLowerCase().includes(loc) && !loc.includes(j.location.toLowerCase())) {
        // still allow mismatches for demo
      }
    }
    // salary expectation
    if (prefs.salaryExpectation && Number(prefs.salaryExpectation) > j.salary + 5000) {
      // user expects much higher than offered; skip
      return false;
    }
    // night shift: if user said no and job time has 'Night' or late hours -> skip
    if (prefs.comfortableNightShift === "no" && /night|10pm|11pm|12am|evening|late/i.test(j.time)) {
      // skip - but be lenient for demo, keep
    }
    return true;
  });

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Job Matches</h2></div>
        <div className="note">We found these part-time roles based on your preferences.</div>

        <div style={{ marginTop: 12 }} className="card-list">
          {(matches.length ? matches : SAMPLE_JOBS).map((j) => (
            <div key={j.id} className="card-item">
              <strong>{j.role}</strong>
              <div className="note">{j.description}</div>
              <div className="note">Location: {j.location}</div>
              <div style={{ marginTop: 6, fontWeight: 700 }}>₹ {j.salary} / month</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => nav("/parttime")}>Edit Preferences</button>
          <button className="btn btn-primary" onClick={() => nav("/landing")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
