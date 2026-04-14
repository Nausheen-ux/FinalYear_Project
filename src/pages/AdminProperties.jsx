import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import PropertyReviewCard from "../components/PropertyReviewCard";
import RejectModal from "../components/RejectModal";
import "../style/AdminProperties.css";

const AdminProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const status = searchParams.get("status") || "pending";
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, [status]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties?status=${status}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setProperties(data.properties);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectConfirm = async (id, reason) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== id));
        setRejectTarget(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = ["pending", "approved", "rejected"];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Properties</h1>
            <p className="admin-subtitle">Review and manage property listings</p>
          </div>
        </div>

        <div className="status-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`status-tab ${status === tab ? "active" : ""} tab-${tab}`}
              onClick={() => setSearchParams({ status: tab })}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner" />
            <p>Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🏠</span>
            <p>No {status} properties found.</p>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyReviewCard
                key={property._id}
                property={property}
                onApprove={() => handleApprove(property._id)}
                onReject={() => setRejectTarget(property)}
                onView={() => navigate(`/admin/properties/${property._id}`)}
              />
            ))}
          </div>
        )}

        {rejectTarget && (
          <RejectModal
            property={rejectTarget}
            onConfirm={(reason) => handleRejectConfirm(rejectTarget._id, reason)}
            onCancel={() => setRejectTarget(null)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminProperties;