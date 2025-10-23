import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import "../style/RentResult.css";

export default function RentResult() {
  const nav = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPrefs, setSearchPrefs] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const prefs = localStorage.getItem("rentPreferences");
      if (!prefs) {
        setError("No search preferences found. Please search again.");
        setLoading(false);
        return;
      }
      const preferences = JSON.parse(prefs);
      setSearchPrefs(preferences);

      const params = new URLSearchParams();
      if (preferences.rentRange) params.append("rentRange", preferences.rentRange);
      if (preferences.sharing) params.append("sharing", preferences.sharing);
      if (preferences.location) params.append("location", preferences.location);
      if (preferences.accommodationType) params.append("accommodationType", preferences.accommodationType);
      if (preferences.genderPreference) params.append("genderPreference", preferences.genderPreference);

      const response = await axios.get(`http://localhost:5000/api/search?${params.toString()}`);
      if (response.data.success) setProperties(response.data.data);
      else setError("Failed to fetch results");
    } catch (err) {
      console.error("Error fetching results:", err);
      setError(err.response?.data?.message || "Failed to fetch accommodation results");
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    localStorage.removeItem("rentPreferences");
    nav("/rent");
  };

  if (loading) {
    return (
      <div className="centered min-60vh">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="loading-text">Searching accommodations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered min-60vh">
        <div className="text-center p-4">
          <div className="alert">{error}</div>
          <button className="btn-primary" onClick={handleNewSearch}>
            &#8592; Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rent-result-page">
      {/* Header */}
      <div className="rent-result-header">
        <div className="header-content">
          <div>
            <h3 className="header-title">&#128269; Search Results</h3>
            <p className="header-subtitle">
              <strong>{properties.length}</strong> accommodation{properties.length !== 1 ? "s" : ""} found
              {searchPrefs?.location && <span className="highlight"> in {searchPrefs.location}</span>}
            </p>
          </div>
          <button className="btn-outline" onClick={handleNewSearch}>
            &#9881; New Search
          </button>
        </div>
      </div>

      {/* Search Summary */}
      {searchPrefs && (
        <div className="search-summary-card">
          <h6>Your Search Criteria:</h6>
          <div className="badges">
            {searchPrefs.rentRange && <span className="badge primary">{searchPrefs.rentRange}</span>}
            {searchPrefs.sharing && <span className="badge info">{searchPrefs.sharing} Sharing</span>}
            {searchPrefs.accommodationType && <span className="badge success">{searchPrefs.accommodationType}</span>}
            {searchPrefs.location && <span className="badge danger">{searchPrefs.location}</span>}
            {searchPrefs.genderPreference && searchPrefs.genderPreference !== "Any" && (
              <span className="badge warning">{searchPrefs.genderPreference} Only</span>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="results-container">
        {properties.length === 0 ? (
          <div className="text-center py-5">
            <div className="no-results">&#128717;</div>
            <h5>No accommodations found</h5>
            <p>We couldn't find any properties matching your search criteria.</p>
            <button className="btn-primary" onClick={handleNewSearch}>
              Modify Search
            </button>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="back-btn-container">
        <button className="btn-outline" onClick={() => nav("/landing")}>
          &#8592; Back to Home
        </button>
      </div>
    </div>
  );
}
