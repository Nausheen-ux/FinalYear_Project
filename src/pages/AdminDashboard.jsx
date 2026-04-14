import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import StatsCard from "../components/StatsCard";
import "../style/AdminLayout.css";
import "../style/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">Welcome back, Admin 👋</p>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner" />
            <p>Loading stats...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <StatsCard label="Total Properties" value={stats?.total ?? 0}    icon="🏠" color="blue" />
              <StatsCard label="Pending Review"   value={stats?.pending ?? 0}  icon="⏳" color="amber"  onClick={() => navigate("/admin/properties?status=pending")} />
              <StatsCard label="Approved"          value={stats?.approved ?? 0} icon="✅" color="green"  onClick={() => navigate("/admin/properties?status=approved")} />
              <StatsCard label="Rejected"          value={stats?.rejected ?? 0} icon="❌" color="red"    onClick={() => navigate("/admin/properties?status=rejected")} />
              <StatsCard label="Total Users"       value={stats?.totalUsers ?? 0} icon="👥" color="purple" onClick={() => navigate("/admin/users")} />
            </div>

            <div className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-cards">
                <button className="action-card pending-action" onClick={() => navigate("/admin/properties?status=pending")}>
                  <span className="action-icon">⏳</span>
                  <div>
                    <p className="action-label">Review Pending</p>
                    <p className="action-desc">{stats?.pending} properties awaiting approval</p>
                  </div>
                  <span className="action-arrow">→</span>
                </button>
                <button className="action-card users-action" onClick={() => navigate("/admin/users")}>
                  <span className="action-icon">👥</span>
                  <div>
                    <p className="action-label">Manage Users</p>
                    <p className="action-desc">View all registered students &amp; owners</p>
                  </div>
                  <span className="action-arrow">→</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;