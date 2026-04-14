// import React from "react";
// import { Navigate } from "react-router-dom";

// const AdminRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   if (!token || user?.role !== "admin") {
//     return <Navigate to="/admin/login" replace />;
//   }
//   return children;
// };

// export default AdminRoute;


import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");   // stored as plain string by Login.jsx

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminRoute;