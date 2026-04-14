import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";

export default function RecommendedSection({ onRefresh }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId =
      localStorage.getItem("userId") ||
      localStorage.getItem("studentId") ||
      localStorage.getItem("id");

    if (!studentId) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/recommendations/${studentId}`)
      .then((res) => {
        if (res.data.success) setRecommendations(res.data.data);
      })
      .catch(() => {}) // silent fail
      .finally(() => setLoading(false));
  }, []);

  // Don't render anything if no recommendations
  if (loading || recommendations.length === 0) return null;

  return (
    <div className="recommendations-section">
      <div className="rent-result-header">
        <div className="header-content">
          <div>
            <h3 className="header-title">✨ Recommended for You</h3>
            <p className="header-subtitle">Based on your search history</p>
          </div>
        </div>
      </div>
      <div className="property-grid">
        {recommendations.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}