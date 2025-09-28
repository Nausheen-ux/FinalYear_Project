

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
 Register page:
 - name, email, password
 - idProof file (image/pdf) -> store filename + if image store dataURL
 - passport photo (image) -> store dataURL for preview
*/
export default function RegisterPage({ onRegister }) {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    idProofName: "",
    idProofDataUrl: null,
    photoDataUrl: null,
  });
  const [errors, setErrors] = useState("");

  const handleText = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const readFileAsDataUrl = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handleIdProof = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    let dataUrl = null;
    if (f.type.startsWith("image/")) {
      dataUrl = await readFileAsDataUrl(f);
    }
    setForm((p) => ({ ...p, idProofName: f.name, idProofDataUrl: dataUrl }));
  };

  const handlePhoto = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrors("Passport photo must be an image file.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(f);
    setForm((p) => ({ ...p, photoDataUrl: dataUrl }));
    setErrors("");
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setErrors("");
    // basic validation
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setErrors("Please fill name, email and password.");
      return;
    }
    if (!form.idProofName) {
      setErrors("Please upload an ID proof (Aadhaar / Voter / Passport).");
      return;
    }
    if (!form.photoDataUrl) {
      setErrors("Please upload a passport-size photo.");
      return;
    }

    // Compose user object
    const user = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      idProofName: form.idProofName,
      idProofDataUrl: form.idProofDataUrl,
      photoDataUrl: form.photoDataUrl,
    };

    const result = onRegister(user);
    if (!result || !result.ok) {
      setErrors(result?.message || "Registration error.");
      return;
    }

    alert("Registration successful — please login.");
    nav("/login");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>Register</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input className="input" name="name" value={form.name} onChange={handleText} required />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input className="input" name="email" type="email" value={form.email} onChange={handleText} required />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input className="input" name="password" type="password" value={form.password} onChange={handleText} required />
            <div className="note">Use a simple password for testing (demo app).</div>
          </div>

          <div className="form-row">
            <label>ID Proof (Aadhaar / Voter / Passport) — image or PDF</label>
            <input className="input" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleIdProof} />
            {form.idProofName && <div className="file-preview">Selected: {form.idProofName}</div>}
          </div>

          <div className="form-row">
            <label>Passport-size photo (image)</label>
            <input className="input" type="file" accept="image/*" onChange={handlePhoto} />
            {form.photoDataUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={form.photoDataUrl} alt="preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }} />
              </div>
            )}
          </div>

          {errors && <div style={{ color: "crimson", marginBottom: 8 }}>{errors}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary">Register</button>
            <button type="button" className="btn btn-ghost" onClick={() => (window.location.href = "/login")}>Go to Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
