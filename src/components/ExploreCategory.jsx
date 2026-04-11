import React from "react";
import { categoryMeta } from "../data/exploreData";
import "../style/Explore.css";

export default function ExploreCategory({ city, onSelect, selected }) {
  return (
    <div className="ec-category-grid">
      {categoryMeta.map(({ key, label, icon, img, color }) => (
        <div
          key={key}
          className={`ec-cat-card ${selected === key ? "ec-cat-active" : ""}`}
          onClick={() => onSelect(key)}
          style={{ "--cat-color": color }}
        >
          <div className="ec-cat-img-wrap">
            <img
              src={img}
              alt={label}
              className="ec-cat-img"
              onError={e => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="ec-cat-img-fallback" style={{ display: "none" }}>
              <span>{icon}</span>
            </div>
            {selected === key && <div className="ec-cat-check">✓</div>}
          </div>
          <div className="ec-cat-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
