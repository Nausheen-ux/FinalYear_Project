import React from "react";
import "../style/StatsCard.css";

const StatsCard = ({ label, value, icon, color, onClick }) => {
  return (
    <div
      className={`stats-card stats-card--${color} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stats-icon">{icon}</div>
      <div className="stats-info">
        <p className="stats-value">{value}</p>
        <p className="stats-label">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;