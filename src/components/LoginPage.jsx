


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    const res = onLogin(email.trim().toLowerCase(), password);
    if (res.ok) {
      nav("/landing");
    } else {
      setErr(res.message || "Invalid credentials");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="header">
          <h2>Login</h2>
        </div>

        <form onSubmit={submit}>
          <div className="form-row">
            <label>Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>

          {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" type="submit">Login</button>
            <button className="btn btn-ghost" type="button" onClick={() => nav("/")}>Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
