// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../style/AdminLogin.css";

// const AdminLogin = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/users/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (data.success && data.user?.role === "admin") {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         navigate("/admin/dashboard");
//       } else if (data.success && data.user?.role !== "admin") {
//         setError("Access denied. Admin accounts only.");
//       } else {
//         setError(data.message || "Invalid credentials.");
//       }
//     } catch (err) {
//       setError("Server error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="admin-login-page">
//       <div className="login-card">
//         <div className="login-brand">
//           <span className="brand-logo">🎓</span>
//           <h1 className="brand-name">CampusOrbit</h1>
//           <p className="brand-tag">Admin Portal</p>
//         </div>

//         <form className="login-form" onSubmit={handleSubmit}>
//           <div className="field-group">
//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="admin@campusorbit.com"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               required
//             />
//           </div>
//           <div className="field-group">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               required
//             />
//           </div>
//           {error && <p className="login-error">{error}</p>}
//           <button type="submit" className="login-btn" disabled={loading}>
//             {loading ? "Signing in..." : "Sign In →"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/AdminLogin.css";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.role === "admin") {
        // Store token the same way regular Login.jsx does
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data._id);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admin/dashboard");
      } else if (res.ok && data.role !== "admin") {
        setError("Access denied. Admin accounts only.");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-logo">🎓</span>
          <h1 className="brand-name">CampusOrbit</h1>
          <p className="brand-tag">Admin Portal</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@campusorbit.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;