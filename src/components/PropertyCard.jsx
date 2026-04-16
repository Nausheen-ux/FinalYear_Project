import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/PropertyCard.css";

export default function PropertyCard({ property, onRefresh }) {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState(property.connectionStatus || "none");
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
        setConnectionStatus("pending");

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
    <>
      <div className="property-card">
        {/* Image Carousel */}
        <div className="property-image-container">
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
              <button className="image-nav-btn image-nav-prev" onClick={prevImage} title="Previous image">
                ‹
              </button>
              <button className="image-nav-btn image-nav-next" onClick={nextImage} title="Next image">
                ›
              </button>
              <div className="image-counter">
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}

          <div className="property-type-badge">
            <span className="badge">
              {property.accommodationType || property.propertyType || "Property"}
            </span>
          </div>
        </div>

        <div className="card-body">
          <h5 className="property-title">
            {property.buildingName || property.title || "Property"}
          </h5>
          <p className="property-location">
            {property.city}
          </p>

          {/* Price - Prominent Display */}
          <div className="price-display mb-3">
            <span className="price-amount">{formatPrice(property.price)}</span>
            <span className="price-label">/month</span>
          </div>

          {/* Quick Details */}
          <div className="property-details mb-3">
            {property.sharing && (
              <div className="detail-item mb-2">
                <small className="text-muted d-block mb-1">Sharing Type</small>
                <div>
                  <span className="room-badge" style={{ backgroundColor: '#d4edda', color: '#155724' }}>
                    {property.sharing}
                  </span>
                </div>
              </div>
            )}

            {property.roomType && property.roomType.length > 0 && (
              <div className="detail-item mb-2">
                <small className="text-muted d-block mb-1">Available Rooms</small>
                <div>
                  {property.roomType.map((type, idx) => (
                    <span key={idx} className="room-badge">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.furnishType && (
              <div className="detail-item mb-2">
                <small className="text-muted d-block mb-1">Furnishing</small>
                <div>
                  <span className="room-badge" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                    {property.furnishType}
                  </span>
                </div>
              </div>
            )}

            {property.gender && (
              <div className="detail-item mb-2">
                <small className="text-muted d-block mb-1">Gender Preference</small>
                <div>
                  <span className="room-badge" style={{ backgroundColor: '#cfe2ff', color: '#084298' }}>
                    {property.gender} Only
                  </span>
                </div>
              </div>
            )}

            {nearestCollege && (
              <div className="detail-item college-distance">
                <small>
                  <strong>{nearestCollege.distance} km</strong> from {nearestCollege.name}
                </small>
              </div>
            )}
          </div>

          {/* Owner Info - Show only if approved */}
          {connectionStatus === "approved" && (
            <div className="owner-info mb-3">
              <h6>✅ Connection Approved!</h6>
              <div className="owner-details">
                {property.ownerInfo?.name && (
                  <p className="mb-1"><strong>Owner:</strong> {property.ownerInfo.name}</p>
                )}
                {property.ownerInfo?.email && (
                  <p className="mb-1"><strong>Email:</strong> {property.ownerInfo.email}</p>
                )}
                {property.ownerInfo?.phone && (
                  <p className="mb-1"><strong>Phone:</strong> {property.ownerInfo.phone}</p>
                )}
                {property.ownerInfo?.address && (
                  <p className="mb-1"><strong>Address:</strong> {property.ownerInfo.address}</p>
                )}
              </div>
            </div>
          )}

          {/* View Details Button */}
          <button 
            className="btn btn-outline-info w-100 mb-2"
            onClick={() => setShowDetailsModal(true)}
          >
            📋 View All Details
          </button>

          {/* Action Section */}
          <div className="action-section mt-auto">
            {connectionStatus === "none" && (
              <>
                <button className="btn btn-success w-100" onClick={handleConnect}>
                  🤝 {showMessageBox ? "Cancel" : "Connect with Owner"}
                </button>

                {showMessageBox && (
                  <div className="message-box mt-3">
                    <textarea
                      className="form-control mb-2"
                      placeholder="Write a message to the owner (optional)"
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <button className="btn btn-primary w-100" onClick={handleSendMessage}>
                      📤 Send Request
                    </button>
                  </div>
                )}
              </>
            )}

            {connectionStatus === "pending" && (
              <button className="btn btn-warning w-100" disabled>
                ⏳ Request Pending
              </button>
            )}

            {connectionStatus === "rejected" && (
              <button className="btn btn-danger w-100" disabled>
                ❌ Request Rejected
              </button>
            )}

            {connectionStatus === "approved" && (
              <button className="btn btn-success w-100" disabled>
                ✅ Connected
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="details-modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h2>📍 Property Details</h2>
              <button 
                className="details-modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="details-modal-body">
              {/* Property Header */}
              <div className="detail-section">
                <h3 className="section-title">🏠 Property Information</h3>
                <div className="detail-row">
                  <label>Building Name:</label>
                  <span>{property.buildingName || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <label>Property Type:</label>
                  <span>{property.accommodationType || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <label>City:</label>
                  <span>{property.city || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <label>Locality:</label>
                  <span>{property.locality || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <label>Address:</label>
                  <span>{property.address || "N/A"}</span>
                </div>
              </div>

              {/* Room Details */}
              <div className="detail-section">
                <h3 className="section-title">🛏️ Room Details</h3>
                <div className="detail-row">
                  <label>Sharing Type:</label>
                  <span>{property.sharing || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <label>Room Types:</label>
                  <span>
                    {property.roomType && property.roomType.length > 0 
                      ? property.roomType.join(", ") 
                      : "N/A"}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Furnishing:</label>
                  <span>{property.furnishType || "N/A"}</span>
                </div>
                {property.gender && (
                  <div className="detail-row">
                    <label>Gender Preference:</label>
                    <span>{property.gender} Only</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="detail-section">
                <h3 className="section-title">💰 Pricing</h3>
                <div className="detail-row">
                  <label>Monthly Price:</label>
                  <span className="price-highlight">{formatPrice(property.price)}</span>
                </div>
              </div>

              {/* College Information */}
              {property.colleges && property.colleges.length > 0 && (
                <div className="detail-section">
                  <h3 className="section-title">🎓 Nearby Colleges</h3>
                  {property.colleges.map((college, idx) => (
                    <div key={idx} className="college-info">
                      <div className="detail-row">
                        <label>College {idx + 1}:</label>
                        <span>{college.name || "N/A"}</span>
                      </div>
                      <div className="detail-row">
                        <label>Distance:</label>
                        <span>{college.distance || "N/A"} km</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Owner Information */}
              <div className="detail-section">
                <h3 className="section-title">👤 Owner Information</h3>
                <div className="detail-row">
                  <label>Owner Name:</label>
                  <span>{property.fullName || "N/A"}</span>
                </div>
                {connectionStatus === "approved" ? (
                  <>
                    <div className="detail-row">
                      <label>Email:</label>
                      <span>
                        <a href={`mailto:${property.ownerInfo?.email || property.email}`}>
                          {property.ownerInfo?.email || property.email || "N/A"}
                        </a>
                      </span>
                    </div>
                    <div className="detail-row">
                      <label>Phone:</label>
                      <span>
                        <a href={`tel:${property.ownerInfo?.phone || property.mobile}`}>
                          {property.ownerInfo?.phone || property.mobile || "N/A"}
                        </a>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="detail-note">
                    ℹ️ Owner contact details will be visible after connection is approved
                  </div>
                )}
              </div>

              {/* Additional Details */}
              {property.createdAt && (
                <div className="detail-section">
                  <h3 className="section-title">📅 Listing Information</h3>
                  <div className="detail-row">
                    <label>Posted On:</label>
                    <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="details-modal-footer">
              {connectionStatus === "none" && (
                <button className="btn btn-success" onClick={handleConnect}>
                  🤝 Connect with Owner
                </button>
              )}
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}