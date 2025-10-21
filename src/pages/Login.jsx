
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

      // ✅ Redirect after login
      if (data.role === "owner") navigate("/post-accommodation");
      else navigate("/landing"); // <-- Redirect to landing page
    } else {
      alert(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
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
    </div>
  );
}

