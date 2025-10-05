

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import RentPage from "./components/RentPage";
import RentResult from './components/RentResult';
import ParttimeJob from "./components/ParttimeJob";
import JobResults from "./components/JobResults";
import RegisterStudent from "./components/RegisterStudent";
import RegisterLandlord from "./components/RegisterLandlord";

export default function App() {
  
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser")) || null;
    } catch {
      return null;
    }
  });

  
  useEffect(() => {
    if (loggedInUser) localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    else localStorage.removeItem("loggedInUser");
  }, [loggedInUser]);

  
  const handleRegister = (user) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.some((u) => u.email === user.email)) {
      return { ok: false, message: "Email already registered" };
    }
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    return { ok: true };
  };

  
  const handleLogin = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setLoggedInUser(user);
      return { ok: true, user };
    }
    return { ok: false, message: "Invalid credentials" };
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Routes>
      {/* Register is first page */}
      <Route path="/" element={<RegisterPage onRegister={handleRegister} />} />

      {/* Login */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* Protected routes: landing, rent, part-time, results */}
      <Route
        path="/landing"
        element={
          loggedInUser ? (
            <LandingPage user={loggedInUser} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/rent"
        element={loggedInUser ? <RentPage user={loggedInUser} /> : <Navigate to="/login" />}
      />
      <Route
        path="/rent-results"
        element={loggedInUser ? <RentResult /> : <Navigate to="/login" />}
      />

      <Route
        path="/ParttimeJob"
        element={loggedInUser ? <ParttimeJob user={loggedInUser} /> : <Navigate to="/login" />}
      />
       <Route path="/register/student" element={<RegisterStudent />} />
       <Route path="/register/landlord" element={<RegisterLandlord />} />
      <Route
        path="/job-results"
        element={loggedInUser ? <JobResults /> : <Navigate to="/login" />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
