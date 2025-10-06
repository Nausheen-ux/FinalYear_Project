

// import React, { useState, useEffect } from "react";
//  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import RegisterPage from "./components/RegisterPage";
// import LoginPage from "./components/LoginPage";
// import LandingPage from "./components/LandingPage";
// 
import RentResult from './components/RentResult';
import ParttimeJob from "./components/ParttimeJob";
import JobResults from "./components/JobResults";
// import RegisterStudent from "./components/RegisterStudent";
// import RegisterLandlord from "./components/RegisterLandlord";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import OwnerDashboard from "./pages/OwnerDashboard";
import RentPage from "./components/RentPage";

function PrivateRoute({ children }) {
   const token = localStorage.getItem("token");
   return token ? children : <Navigate to="/login" />;
   }
export default function App() {
  
  // const [loggedInUser, setLoggedInUser] = useState(() => {
  //   try {
  //     return JSON.parse(localStorage.getItem("loggedInUser")) || null;
  //   } catch {
  //     return null;
  //   }
  // });

  
  // useEffect(() => {
  //   if (loggedInUser) localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  //   else localStorage.removeItem("loggedInUser");
  // }, [loggedInUser]);

  
  // const handleRegister = (user) => {
  //   const users = JSON.parse(localStorage.getItem("users") || "[]");
    
  //   if (users.some((u) => u.email === user.email)) {
  //     return { ok: false, message: "Email already registered" };
  //   }
  //   users.push(user);
  //   localStorage.setItem("users", JSON.stringify(users));
  //   return { ok: true };
  // };

  
  // const handleLogin = (email, password) => {
  //   const users = JSON.parse(localStorage.getItem("users") || "[]");
  //   const user = users.find((u) => u.email === email && u.password === password);
  //   if (user) {
  //     setLoggedInUser(user);
  //     return { ok: true, user };
  //   }
  //   return { ok: false, message: "Invalid credentials" };
  // };

  // const handleLogout = () => {
  //   setLoggedInUser(null);
  // };

  return (
    //  <BrowserRouter>
     
    
    // <Routes>
    //   {/* Register is first page */}
    //   <Route path="/" element={<RegisterPage onRegister={handleRegister} />} />

    //   {/* Login */}
    //   <Route path="/login" element={<Login />} />

    //   {/* Protected routes: landing, rent, part-time, results */}
    //   <Route
    //     path="/landing"
    //     element={
    //       loggedInUser ? (
    //         <LandingPage user={loggedInUser} onLogout={handleLogout} />
    //       ) : (
    //         <Navigate to="/login" />
    //       )
    //     }
    //   />

    //   <Route
    //     path="/rent"
    //     element={ <PrivateRoute><RentPage /></PrivateRoute> }
    //   />
    //   <Route
    //     path="/rent-results"
    //     element={<PrivateRoute><RentResult  /></PrivateRoute>}
    //   />

      

    //   {/* Fallback */}
    //   <Route path="*" element={<Navigate to="/" />} />
    // </Routes>
    //  </BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<PrivateRoute><Browse /></PrivateRoute>} />
        <Route path="/owner-dashboard" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />
        <Route path="/rent" element={<PrivateRoute><RentPage /></PrivateRoute>} />
        <Route path="/rent-results" element={<PrivateRoute><RentResult /></PrivateRoute>} />
        <Route path="/ParttimeJob" element={<PrivateRoute><ParttimeJob/> </PrivateRoute>}/>
        <Route path="/job-results" element={<PrivateRoute><JobResults/></PrivateRoute>}/>
      </Routes>
    
  );
}



