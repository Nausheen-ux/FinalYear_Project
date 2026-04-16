import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PostedProperties.css";

export default function PostedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [connections, setConnections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const ownerId = localStorage.getItem("ownerId");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/accommodation/owner/${ownerId}`
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [ownerId]);

  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/accommodation/${propertyId}`);
      setProperties(properties.filter((prop) => prop._id !== propertyId));
      alert("Property deleted successfully!");
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property. Please try again.");
    }
  };

  const handleViewConnections = async (propertyId) => {
    try {
      setSelectedProperty(propertyId);
      setShowModal(true);
      const response = await axios.get(
        `http://localhost:5000/api/connection-requests/property/${propertyId}`
      );
      setConnections(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      alert("Failed to fetch connections. Please try again.");
    }
  };

  const handleConnectionAction = async (connectionId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/connection-requests/${connectionId}/status`, { status });
      setConnections((prev) =>
        prev.map((conn) => conn._id === connectionId ? { ...conn, status } : conn)
      );
      alert(`Connection ${status} successfully!`);
    } catch (error) {
      console.error("Error updating connection:", error);
      alert("Failed to update connection status.");
    }
  };

  const openImageGallery = (images) => {
    setSelectedImages(images);
    setCurrentImageIndex(0);
    setShowImageModal(true);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showImageModal) {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") setShowImageModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showImageModal, selectedImages]);

  if (loading) return <p className="text-center mt-5">Loading your posted properties...</p>;
  if (properties.length === 0) return <p className="text-center mt-5">You have not posted any properties yet.</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Your Posted Properties</h2>
      <div className="row">
        {properties.map((property) => (
          <div className="col-md-4 mb-4" key={property._id}>
            <div className="card h-100 shadow-sm position-relative">

              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(property._id); }}
                className="btn btn-danger btn-sm position-absolute"
                title="Delete Property"
                style={{ zIndex: 100, top: "10px", right: "10px" }}
              >✕</button>

              <button
                onClick={(e) => { e.stopPropagation(); handleViewConnections(property._id); }}
                className="btn btn-info btn-sm position-absolute"
                title="View Connection Requests"
                style={{ zIndex: 100, top: "10px", left: "10px" }}
              >👥</button>

              {property.images && property.images.length > 0 ? (
                <div
                  className="position-relative"
                  onClick={() => openImageGallery(property.images)}
                  style={{ cursor: "pointer", height: "200px", overflow: "hidden" }}
                >
                  <img
                    src={`http://localhost:5000${property.images[0]}`}
                    className="card-img-top"
                    alt={property.buildingName}
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                  {property.images.length > 1 && (
                    <div style={{
                      position: "absolute", bottom: "10px", right: "10px",
                      backgroundColor: "rgba(0,0,0,0.8)", color: "white",
                      padding: "8px 15px", borderRadius: "20px",
                      fontSize: "14px", fontWeight: "bold"
                    }}>
                      +{property.images.length - 1}
                    </div>
                  )}
                </div>
              ) : (
                <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: "200px" }}>
                  No Image
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{property.buildingName}</h5>

                <p className="card-text mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                  <i className="bi bi-geo-alt-fill"></i> {property.address}
                </p>

                <p className="card-text mb-1"><strong>City:</strong> {property.city}</p>

                {property.locality && (
                  <p className="card-text mb-1"><strong>Locality:</strong> {property.locality}</p>
                )}

                {/* ✅ Fixed: propertyType → accommodationType */}
                <p className="card-text mb-1">
                  <strong>Type:</strong> {property.accommodationType || property.propertyType || "—"}
                </p>

                {property.sharing && (
                  <p className="card-text mb-1"><strong>Sharing:</strong> {property.sharing}</p>
                )}

                {property.gender && (
                  <p className="card-text mb-1"><strong>Gender:</strong> {property.gender}</p>
                )}

                <p className="card-text mb-1"><strong>Room:</strong> {property.roomType?.join(", ")}</p>
                <p className="card-text mb-1"><strong>Furnish:</strong> {property.furnishType}</p>
                <p className="card-text mb-1"><strong>Price:</strong> ₹{property.price}/month</p>
                <p className="card-text mb-1"><strong>Mobile:</strong> {property.mobile}</p>
                <p className="card-text mb-2"><strong>Email:</strong> {property.email}</p>

                {property.images && property.images.length > 1 && (
                  <p className="card-text mb-1 text-info">
                    <i className="bi bi-images"></i> {property.images.length} images uploaded
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Requests Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Connection Requests</h4>
              <button className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>
            {connections.length === 0 ? (
              <p className="text-muted">No connection requests yet for this property.</p>
            ) : (
              connections.map((conn) => (
                <div key={conn._id} className="connection-card mb-3 p-3 border rounded">
                  <p className="mb-2"><strong>Name:</strong> {conn.studentId?.name || "Unknown"}</p>
                  <p className="mb-2"><strong>Email:</strong> {conn.studentId?.email || "No email"}</p>
                  <p className="mb-2"><strong>Message:</strong> {conn.message || "No message"}</p>
                  <p className="mb-3">
                    <strong>Status:</strong>{" "}
                    <span className={`badge ${
                      conn.status === "approved" ? "bg-success" :
                      conn.status === "rejected" ? "bg-danger" : "bg-secondary"
                    }`}>
                      {conn.status || "pending"}
                    </span>
                  </p>
                  {conn.status === "pending" && (
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-success" onClick={() => handleConnectionAction(conn._id, "approved")}>✓ Approve</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleConnectionAction(conn._id, "rejected")}>✕ Reject</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal-content text-center" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close position-absolute top-0 end-0 m-3" onClick={() => setShowImageModal(false)}></button>
            <img
              src={`http://localhost:5000${selectedImages[currentImageIndex]}`}
              alt="Property"
              style={{ width: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: "10px" }}
            />
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-secondary" onClick={prevImage}>← Previous</button>
              <span>{currentImageIndex + 1} / {selectedImages.length}</span>
              <button className="btn btn-secondary" onClick={nextImage}>Next →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
