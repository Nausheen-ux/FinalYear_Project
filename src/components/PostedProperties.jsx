import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PostedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const ownerId =localStorage.getItem("ownerId");// Replace with actual logged-in user ID

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
  }, []);

  // Delete property handler
  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/accommodations/${propertyId}`);
      // Remove deleted property from state
      setProperties(properties.filter((prop) => prop._id !== propertyId));
      alert("Property deleted successfully!");
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading your posted properties...</p>;
  }

  if (properties.length === 0) {
    return <p className="text-center mt-5">You have not posted any properties yet.</p>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Your Posted Properties</h2>
      <div className="row">
        {properties.map((property) => (
          <div className="col-md-4 mb-4" key={property._id}>
            <div className="card h-100 shadow-sm position-relative">
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(property._id)}
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                title="Delete Property"
              >
                ❌
              </button>

              {property.images && property.images.length > 0 ? (
                <img
                  src={`http://localhost:5000${property.images[0]}`}
                  className="card-img-top"
                  alt={property.buildingName}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="card-img-top d-flex align-items-center justify-content-center bg-light"
                  style={{ height: "200px" }}
                >
                  No Image
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{property.buildingName}</h5>
                <p className="card-text mb-1">
                  <strong>Type:</strong> {property.propertyType}
                </p>
                <p className="card-text mb-1">
                  <strong>Room:</strong> {property.roomType.join(", ")}
                </p>
                <p className="card-text mb-1">
                  <strong>Furnish:</strong> {property.furnishType}
                </p>
                <p className="card-text mb-1">
                  <strong>Price:</strong> ₹{property.price}
                </p>
                <p className="card-text mb-1">
                  <strong>City:</strong> {property.city}
                </p>
                <div className="mt-auto d-flex justify-content-between">
                  <Link
                    to={`/edit-property/${property._id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/property/${property._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
