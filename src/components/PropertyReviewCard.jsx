import React from "react";
import "../style/PropertyReviewCard.css";

const PropertyReviewCard = ({ property, onApprove, onReject, onView }) => {
  const { buildingName, accommodationType, city, price, owner, images, status, createdAt } = property;

  return (
    <div className="review-card">
      <div className="review-card__image">
        {images && images[0] ? (
          <img src={images[0]} alt={buildingName} />
        ) : (
          <div className="image-placeholder">🏠</div>
        )}
        <span className={`status-badge status-${status}`}>{status}</span>
      </div>

      <div className="review-card__body">
        <h3 className="review-card__title">{buildingName}</h3>
        <div className="review-card__meta">
          <span>📍 {city}</span>
          <span>🏷️ {accommodationType}</span>
          <span>💰 ₹{price?.toLocaleString()}/mo</span>
        </div>

        <div className="review-card__owner">
          <div className="owner-avatar">{owner?.name?.[0]?.toUpperCase()}</div>
          <div>
            <p className="owner-name">{owner?.name}</p>
            <p className="owner-email">{owner?.email}</p>
          </div>
        </div>

        <p className="review-card__date">
          Submitted:{" "}
          {new Date(createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </p>
      </div>

      <div className="review-card__actions">
        <button className="btn-view" onClick={onView}>👁 View Details</button>
        {status === "pending" && (
          <>
            <button className="btn-approve" onClick={onApprove}>✅ Approve</button>
            <button className="btn-reject" onClick={onReject}>❌ Reject</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyReviewCard;