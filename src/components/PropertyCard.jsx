import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../style/PropertyCard.css";

export default function PropertyCard({ property }) {
  const [showContact, setShowContact] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["/placeholder-property.jpg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nearestCollege = property.colleges && property.colleges.length > 0 
    ? property.colleges[0] 
    : null;

  return (
    <div className="property-card card h-100 border-0">
      {/* Image Carousel */}
      <div className="property-image-container position-relative">
        <img
          src={`http://localhost:5000${images[currentImageIndex]}`}
          alt={property.buildingName}
          className="property-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image+Available";
          }}
        />
        
        {/* Image Navigation */}
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

        {/* Property Type Badge */}
        <div className="property-type-badge">
          <span className="badge bg-primary">
            <i className="bi bi-building me-1"></i>
            {property.propertyType}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column">
        {/* Property Name & Location */}
        <h5 className="card-title property-title mb-2">{property.buildingName}</h5>
        <p className="property-location mb-3">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
          {property.city}
        </p>

        {/* Property Details Grid */}
        <div className="property-details mb-3">
          {/* Room Types */}
          <div className="detail-item mb-2">
            <small className="text-muted d-block mb-1">
              <i className="bi bi-door-open me-1"></i>
              Available Rooms
            </small>
            <div>
              {property.roomType && property.roomType.map((type, idx) => (
                <span key={idx} className="badge bg-light text-dark me-1 room-badge">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Furnish Type */}
          <div className="detail-item mb-2">
            <small className="text-muted">
              <i className="bi bi-house-door me-1"></i>
              <strong>{property.furnishType}</strong>
            </small>
          </div>

          {/* Distance from College */}
          {nearestCollege && (
            <div className="detail-item college-distance mb-2">
              <i className="bi bi-mortarboard-fill text-success me-1"></i>
              <small className="text-success fw-medium">
                {nearestCollege.distance} km from {nearestCollege.name}
              </small>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="price-section mt-auto pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="property-price mb-0">{formatPrice(property.price)}</h4>
              <small className="text-muted">per month</small>
            </div>
            <div>
              <i className="bi bi-cash-coin text-success" style={{ fontSize: "1.5rem" }}></i>
            </div>
          </div>
        </div>

        {/* Landlord Info */}
        <div className="landlord-section mt-3 pt-3 border-top">
          <div className="d-flex align-items-center mb-2">
            <div className="landlord-avatar me-2">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="flex-grow-1">
              <small className="text-muted d-block">Property Owner</small>
              <strong className="landlord-name">
                {property.ownerId?.name || property.fullName}
              </strong>
            </div>
          </div>

          {/* Contact Button */}
          {!showContact ? (
            <button
              className="btn btn-primary w-100 contact-btn"
              onClick={() => setShowContact(true)}
            >
              <i className="bi bi-telephone-fill me-2"></i>
              Show Contact Details
            </button>
          ) : (
            <div className="contact-details mt-2">
              <div className="alert alert-info contact-alert mb-2">
                <i className="bi bi-telephone-fill me-2"></i>
                <strong>{property.mobile}</strong>
              </div>
              <div className="alert alert-info contact-alert mb-0">
                <i className="bi bi-envelope-fill me-2"></i>
                <strong style={{ fontSize: "0.875rem", wordBreak: "break-all" }}>
                  {property.email}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Address Collapse */}
        <div className="mt-3">
          <button
            className="btn btn-link btn-sm text-decoration-none p-0 w-100 text-start address-toggle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#details-${property._id}`}
          >
            <small>
              <i className="bi bi-info-circle me-1"></i>
              View full address 
              <i className="bi bi-chevron-down ms-1"></i>
            </small>
          </button>
          <div className="collapse mt-2" id={`details-${property._id}`}>
            <div className="alert alert-light address-alert mb-0">
              <small>
                <i className="bi bi-map me-2"></i>
                {property.address}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}