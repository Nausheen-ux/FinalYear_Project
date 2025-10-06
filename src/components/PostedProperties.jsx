import React, { useState } from "react";
import "./PostedProperties.css"; // create a css file for styling

const PostedProperties = () => {
  // Dummy posted properties (later you will fetch from backend)
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "2 BHK Apartment in Lakeview Residency",
      location: "Kolkata, Near Jadavpur University",
      price: "₹12,000/month",
      description: "Spacious 2 BHK with semi-furnished interior, close to metro station.",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 2,
      title: "Independent Floor near Tech Park",
      location: "Bengaluru, Whitefield",
      price: "₹18,500/month",
      description: "1 BHK independent floor, fully furnished, ideal for working professionals.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=60",
    },
  ]);

  return (
    <div className="posted-properties-container">
      <h2 className="page-title">My Posted Properties</h2>

      <div className="properties-list">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <img
              src={property.image}
              alt={property.title}
              className="property-image"
            />
            <div className="property-info">
              <h3 className="property-title">{property.title}</h3>
              <p className="property-location">{property.location}</p>
              <p className="property-description">{property.description}</p>
              <p className="property-price">{property.price}</p>
              <button className="details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostedProperties;
