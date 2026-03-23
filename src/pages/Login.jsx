
// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../style/Login.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Get the page user was trying to access before login
//   const from = location.state?.from || null;

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const res = await fetch("/api/users/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       // ✅ Store all info locally
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.role);
//       localStorage.setItem("userId", data._id);
//       localStorage.setItem("ownerId", data._id);
//       localStorage.setItem("ownerName", data.name);
//       localStorage.setItem("userName", data.name);

//       // ✅ Redirect based on role and where they came from
//       if (from) {
//         // If they were trying to access a specific page (like /forum/create)
//         navigate(from);
//       } else if (data.role === "owner") {
//         navigate("/post-accommodation");
//       } else {
//         navigate("/landing");
//       }
//     } else {
//       alert(data.message || "Invalid credentials");
//     }
//   };

//   return (
//     <div className="form">
//       <h2>Login</h2>
//       {from && (
//         <p className="alert alert-info" style={{ fontSize: "0.9rem", padding: "10px" }}>
//           Please log in to continue
//         </p>
//       )}
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//       <p className="mt-3">
//         Don't have an account?{" "}
//         <span
//           style={{ color: "#5a2ca0", cursor: "pointer", textDecoration: "underline" }}
//           onClick={() => navigate("/register", { state: { from } })}
//         >
//           Register here
//         </span>
//       </p>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || null;

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data._id);
      localStorage.setItem("ownerId", data._id);
      localStorage.setItem("ownerName", data.name);
      localStorage.setItem("userName", data.name);

      if (from) {
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

  // 🔑 FORGOT PASSWORD (frontend version)
  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!resetEmail) {
      alert("Please enter your email");
      return;
    }

    // 👉 For now (frontend demo)
    alert(`Password reset link sent to ${resetEmail} 📩`);

    // later → connect backend API here

    setShowForgot(false);
    setResetEmail("");
  };

  return (
    <div className="form">
      <h2>{showForgot ? "Reset Password 🔑" : "Login"}</h2>

      {from && !showForgot && (
        <p className="alert alert-info" style={{ fontSize: "0.9rem", padding: "10px" }}>
          Please log in to continue
        </p>
      )}

      {/* 🔐 LOGIN FORM */}
      {!showForgot ? (
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

          {/* 🔥 Forgot Password */}
          <p
            style={{
              marginTop: "10px",
              color: "#5a2ca0",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </p>

        </form>
      ) : (

        /* 🔑 RESET PASSWORD FORM */
        <form onSubmit={handleForgotPassword}>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>

          <p
            style={{
              marginTop: "10px",
              color: "#5a2ca0",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem"
            }}
            onClick={() => setShowForgot(false)}
          >
            Back to Login
          </p>

        </form>
      )}

      {/* Register Link */}
      {!showForgot && (
        <p className="mt-3">
          Don't have an account?{" "}
          <span
            style={{
              color: "#5a2ca0",
              cursor: "pointer",
              textDecoration: "underline"
            }}
            onClick={() => navigate("/register", { state: { from } })}
          >
            Register here
          </span>
        </p>
      )}
    </div>
  );
}