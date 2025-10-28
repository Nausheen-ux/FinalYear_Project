import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PropertyCard({ property, onRefresh }) {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState(property.connectionStatus || "none");

  // ✅ Image rendering
  const images =
    property.images && property.images.length > 0
      ? property.images.map((img) =>
          img.startsWith("http")
            ? img
            : `http://localhost:5000${img.startsWith("/") ? img : `/${img}`}`
        )
      : ["https://placehold.co/400x300?text=No+Image"];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const nearestCollege =
    property.colleges && property.colleges.length > 0 ? property.colleges[0] : null;

  // ✅ Connect logic
  const handleConnect = (e) => {
    e.stopPropagation();
    setShowMessageBox(!showMessageBox);
  };

  const handleSendMessage = async () => {
    try {
      const studentId =
        localStorage.getItem("userId") ||
        localStorage.getItem("ownerId") ||
        localStorage.getItem("id") ||
        localStorage.getItem("studentId");

      if (!studentId) {
        alert("Please log in first to send a connection request.");
        return;
      }

      const ownerId = property.ownerId?._id || property.ownerId;
      if (!ownerId) {
        alert("Owner information not available. Try again later.");
        return;
      }

      console.log("📤 Sending connection request:", {
        propertyId: property._id,
        studentId,
        ownerId,
        message,
      });

      const response = await fetch("http://localhost:5000/api/connection-requests/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property._id,
          studentId,
          ownerId,
          message: message || "I am interested in your property.",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Connection request sent successfully! Wait for owner approval.");
        setMessage("");
        setShowMessageBox(false);
        setConnectionStatus("pending"); // ✅ Set to pending after sending
        
        // ✅ Call parent refresh to update all cards
        if (onRefresh) {
          onRefresh();
        }
      } else {
        console.error("⚠️ Failed to send message:", data);
        alert(data.message || "⚠️ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("❌ Network error while sending message:", error);
      alert("❌ Network error while sending message.");
    }
  };

  return (
    <div className="property-card card h-100 border-0 shadow-sm">
      {/* Image Carousel */}
      <div className="property-image-container position-relative">
        <img
          src={images[currentImageIndex]}
          alt={property.buildingName || "Property"}
          className="property-image"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=No+Image";
          }}
        />

        {images.length > 1 && (
          <>
            <button
              className="btn btn-light btn-sm image-nav-btn image-nav-prev"
              onClick={prevImage}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-light btn-sm image-nav-btn image-nav-next"
              onClick={nextImage}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
            <div className="image-counter">
              {currentImageIndex + 1}/{images.length}
            </div>
          </>
        )}

        <div className="property-type-badge">
          <span className="badge bg-primary">
            <i className="bi bi-building me-1"></i>
            {property.propertyType}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title property-title mb-2">{property.buildingName}</h5>
        <p className="property-location mb-3">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
          {property.city}
        </p>

        <div className="property-details mb-3">
          <div className="detail-item mb-2">
            <small className="text-muted d-block mb-1">
              <i className="bi bi-door-open me-1"></i>
              Available Rooms
            </small>
            <div>
              {property.roomType &&
                property.roomType.map((type, idx) => (
                  <span key={idx} className="badge bg-light text-dark me-1 room-badge">
                    {type}
                  </span>
                ))}
            </div>
          </div>

          <div className="detail-item mb-2">
            <small className="text-muted">
              <i className="bi bi-house-door me-1"></i>
              <strong>{property.furnishType}</strong>
            </small>
          </div>

          <div className="detail-item mb-2">
            <small className="text-muted">
              <i className="bi bi-currency-rupee me-1"></i>
              <strong className="text-success">{formatPrice(property.price)}/month</strong>
            </small>
          </div>

          {nearestCollege && (
            <div className="detail-item college-distance mb-2">
              <i className="bi bi-mortarboard-fill text-success me-1"></i>
              <small className="text-success fw-medium">
                {nearestCollege.distance} km from {nearestCollege.name}
              </small>
            </div>
          )}
        </div>

        {/* ✅ Owner Info (Visible only after connection approved) */}
        {connectionStatus === "approved" && (
          <div className="owner-info border-top pt-3 mt-3">
            <h6 className="text-success">✅ Connection Approved!</h6>
            <p className="mb-1">
              <strong>Owner:</strong> {property.ownerInfo?.name || "N/A"}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {property.ownerInfo?.email || "Not Provided"}
            </p>
            <p className="mb-1">
              <strong>Phone:</strong> {property.ownerInfo?.phone || "Not Provided"}
            </p>
            <p className="mb-1">
              <strong>Address:</strong> {property.ownerInfo?.address || "Not Provided"}
            </p>
          </div>
        )}

        {/* ✅ Connect Button - Show only if no connection */}
        {connectionStatus === "none" && (
          <>
            <button className="btn btn-success w-100 mt-3" onClick={handleConnect}>
              {showMessageBox ? "Cancel" : "🤝 Connect"}
            </button>

            {showMessageBox && (
              <div className="mt-3">
                <textarea
                  className="form-control mb-2"
                  placeholder="Write a message to the owner (optional)"
                  rows="2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button className="btn btn-primary w-100" onClick={handleSendMessage}>
                  Send Request
                </button>
              </div>
            )}
          </>
        )}

        {/* ✅ Show status for pending/rejected */}
        {connectionStatus === "pending" && (
          <button className="btn btn-warning w-100 mt-3" disabled>
            ⏳ Request Pending
          </button>
        )}

        {connectionStatus === "rejected" && (
          <button className="btn btn-danger w-100 mt-3" disabled>
            ❌ Request Rejected
          </button>
        )}

        {connectionStatus === "approved" && (
          <button className="btn btn-success w-100 mt-3" disabled>
            ✅ Connected
          </button>
        )}
      </div>
    </div>
  );
}