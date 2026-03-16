import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
 Full Part-time job preference form with:
 - qualification
 - nationality (Indian / Not Indian -> country)
 - isStudent -> college + college ID upload
 - age
 - comfortable with night shift
 - preferred location
 - preferred job role (dropdown of part-time roles)
 - preferred time
 - salary expectation
 - optional resume upload
*/
const JOB_ROLES = [
  "Tutor / Teaching Assistant",
  "Delivery Rider / Delivery Partner",
  "Retail Associate / Sales",
  "Data Entry / Backoffice",
  "Library assistant",
  "Freelance Content Writer",
  "Graphic Designer (Freelance)",
  "Customer Support (Work from Home)",
  "Barista / Cafe Staff",
  "Event Staff / Helper",
  "Pet sitter/Animal caretaker",
  "Babysitter/Nanny",
  "Research Assistant (Part-time)",
];

export default function PartTimeJob() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    qualification: "",
    isIndian: "yes",
    country: "",
    isStudent: "no",
    collegeName: "",
    collegeIdNumber: "",
    collegeIdName: "",
    age: "",
    comfortableNightShift: "no",
    preferredLocation: "",
    preferredJobRole: "",
    preferredTime: "",
    salaryExpectation: "",
    resumeName: "",
  });
  const [filePreviews, setFilePreviews] = useState({ collegeId: null, resume: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (!file) return;
      // store filename and if image preview
      setForm((p) => ({ ...p, [name + "Name"]: file.name })); // e.g., collegeIdName
      if (file.type.startsWith("image/")) {
        const fr = new FileReader();
        fr.onload = () => {
          setFilePreviews((p) => ({ ...p, [name]: fr.result }));
        };
        fr.readAsDataURL(file);
      } else {
        setFilePreviews((p) => ({ ...p, [name]: null }));
      }
      // store file object name under key (we can't store file object in state persistently)
      setForm((p) => ({ ...p, [name]: file.name }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.qualification) return "Please select your qualification.";
    if (!form.preferredJobRole) return "Please select a job role.";
    if (!form.preferredTime) return "Please enter preferred time.";
    if (!form.salaryExpectation || isNaN(Number(form.salaryExpectation))) return "Enter a numeric salary expectation.";
    if (form.isIndian === "no" && !form.country) return "Please enter your country.";
    if (!form.age || Number(form.age) < 16) return "Enter valid age (>=16).";
    if (form.isStudent === "yes") {
      if (!form.collegeName) return "Enter college/university name.";
      if (!form.collegeIdNumber) return "Enter college/university ID number.";
    }
    return null;
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    // Save preferences and navigate to results - store in localStorage
    localStorage.setItem("jobPreferences", JSON.stringify(form));
    nav("/job-results");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header"><h2>Part-time Jobs — Preferences</h2></div>

        <form onSubmit={submit}>
          <div className="form-row">
            <label>Qualification</label>
            <select name="qualification" value={form.qualification} onChange={handleChange} className="input" required>
              <option value="">Select</option>
              <option>High School (10+2)</option>
              <option>Diploma</option>
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid">
            <div>
              <label>Nationality</label>
              <div>
                <select name="isIndian" value={form.isIndian} onChange={handleChange} className="input">
                  <option value="yes">Indian</option>
                  <option value="no">Not Indian</option>
                </select>
              </div>
            </div>

            <div>
              <label>Age</label>
              <input type="number" name="age" className="input" value={form.age} onChange={handleChange} min="16" />
            </div>
          </div>

          {form.isIndian === "no" && (
            <div className="form-row">
              <label>Which country?</label>
              <input name="country" className="input" value={form.country} onChange={handleChange} />
            </div>
          )}

          <div className="form-row">
            <label>Are you a student?</label>
            <select name="isStudent" value={form.isStudent} onChange={handleChange} className="input">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {form.isStudent === "yes" && (
            <>
              <div className="form-row">
                <label>College / University</label>
                <input name="collegeName" className="input" value={form.collegeName} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>College / University ID</label>
                <input name="collegeIdNumber" className="input" value={form.collegeIdNumber} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Upload College ID (image/pdf)</label>
                <input type="file" name="collegeId" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleChange({ target: { name: "collegeId", files: e.target.files } })} />
                {filePreviews.collegeId && <img src={filePreviews.collegeId} alt="college id" style={{ width: 100, marginTop: 8 }} />}
              </div>
            </>
          )}

          <div className="form-row">
            <label>Comfortable with night shift?</label>
            <select name="comfortableNightShift" value={form.comfortableNightShift} onChange={handleChange} className="input">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="form-row">
            <label>Preferred Location</label>
            <input name="preferredLocation" className="input" value={form.preferredLocation} onChange={handleChange} placeholder="City or area" />
          </div>

          <div className="form-row">
            <label>Preferred Job Role</label>
            <select name="preferredJobRole" value={form.preferredJobRole} onChange={handleChange} className="input">
              <option value="">Choose a part-time role</option>
              {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="grid">
            <div>
              <label>Preferred Time</label>
              <input name="preferredTime" className="input" value={form.preferredTime} onChange={handleChange} placeholder="e.g., 6pm-9pm (Weekdays)" />
            </div>
            <div>
              <label>Salary Expectation (₹ / month)</label>
              <input name="salaryExpectation" className="input" value={form.salaryExpectation} onChange={handleChange} type="number" />
            </div>
          </div>

          <div className="form-row">
            <label>Upload Resume (optional)</label>
            <input type="file" name="resume" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => handleChange({ target: { name: "resume", files: e.target.files } })} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary">Search Jobs</button>
            <button type="button" className="btn btn-ghost" onClick={() => nav("/landing")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
