import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../style/Register.css';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get the page user was trying to access before registration
  const from = location.state?.from || null;

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Auto-login after registration
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data._id);
        localStorage.setItem("ownerId", data._id);
        localStorage.setItem("ownerName", data.name);
        localStorage.setItem("userName", data.name);

        alert("Registration successful!");

        // ✅ Redirect based on where they came from or role
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
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>
      {from && (
        <p className="alert alert-info" style={{ fontSize: "0.9rem", padding: "10px" }}>
          Please register to continue
        </p>
      )}
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="owner">Property Owner</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p className="mt-3">
        Already have an account?{" "}
        <span
          style={{ color: "#5a2ca0", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/login", { state: { from } })}
        >
          Login here
        </span>
      </p>
    </div>
  );
}