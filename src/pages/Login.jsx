
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get the page user was trying to access before login
  const from = location.state?.from || null;

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Store all info locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data._id);
      localStorage.setItem("ownerId", data._id);
      localStorage.setItem("ownerName", data.name);
      localStorage.setItem("userName", data.name);

      // ✅ Redirect based on role and where they came from
      if (from) {
        // If they were trying to access a specific page (like /forum/create)
        navigate(from);
      } else if (data.role === "owner") {
        navigate("/post-accommodation");
      } else {
        navigate("/landing");
      }
    } else {
      alert(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      {from && (
        <p className="alert alert-info" style={{ fontSize: "0.9rem", padding: "10px" }}>
          Please log in to continue
        </p>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="mt-3">
        Don't have an account?{" "}
        <span
          style={{ color: "#5a2ca0", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/register", { state: { from } })}
        >
          Register here
        </span>
      </p>
    </div>
  );
}