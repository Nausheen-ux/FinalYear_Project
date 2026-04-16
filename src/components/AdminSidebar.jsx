import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../style/AdminLayout.css";
import "../style/AdminSidebar.css";

const navItems = [
  { to: "/admin/dashboard",              icon: "📊", label: "Dashboard" },
  { to: "/admin/properties?status=pending",  icon: "⏳", label: "Pending" },
  { to: "/admin/properties?status=approved", icon: "✅", label: "Approved" },
  { to: "/admin/properties?status=rejected", icon: "❌", label: "Rejected" },
  { to: "/admin/users",                  icon: "👥", label: "Users" },
  { to: "/admin/forum",                  icon: "💬", label: "Forum" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">🎓</span>
        <div>
          <p className="sidebar-name">CampusOrbit</p>
          <p className="sidebar-role">Admin Panel</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span>🚪</span> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;