

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // <-- important

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        // store user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data._id);
        localStorage.setItem("ownerId", data._id);
        localStorage.setItem("ownerName", data.name);
        localStorage.setItem("userName", data.name);

        alert("Registration successful 🎉");

        // NAVIGATION LOGIC BASED ON ROLE
        if (from) {
          navigate(from);
        } else if (data.role === "owner") {
          navigate("/post-accommodation");
        } else {
          navigate("/landing");
        }
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="register-page">
      <div className="form">

        <h2>Register</h2>

        {from && <p className="alert-msg">Please register to continue</p>}

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ROLE SELECTION (Student / Owner) */}
          <select
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student"> Student</option>
            <option value="owner">Property Owner</option>
          </select>

          <button type="submit">Register</button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>

      </div>
    </div>
  );
}