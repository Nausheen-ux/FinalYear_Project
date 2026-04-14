


import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { exploreData, categoryMeta } from "../data/exploreData";
import ExploreCategory from "./ExploreCategory";
import "../style/Explore.css";

/* ─── coordinates for every nearby destination ─── */
const DEST_COORDS = {
  /* Delhi nearby */
  "Agra (Taj Mahal)":    { lat: 27.1751, lng: 78.0421 },
  "Jaipur":              { lat: 26.9124, lng: 75.7873 },
  "Mathura & Vrindavan": { lat: 27.4924, lng: 77.6737 },
  "Rishikesh":           { lat: 30.0869, lng: 78.2676 },
  /* Kolkata nearby */
  "Sundarbans":          { lat: 21.9497, lng: 89.1833 },
  "Digha Beach":         { lat: 21.6263, lng: 87.5086 },
  "Darjeeling":          { lat: 27.0360, lng: 88.2627 },
  "Shantiniketan":       { lat: 23.6817, lng: 87.6869 },
  /* Mumbai nearby */
  "Lonavala & Khandala": { lat: 18.7481, lng: 73.4072 },
  "Alibaug":             { lat: 18.6414, lng: 72.8722 },
  "Pune":                { lat: 18.5204, lng: 73.8567 },
  "Matheran":            { lat: 18.9842, lng: 73.2697 },
  /* Bangalore nearby */
  "Mysore":              { lat: 12.2958, lng: 76.6394 },
  "Coorg":               { lat: 12.3375, lng: 75.8069 },
  "Hampi":               { lat: 15.3350, lng: 76.4600 },
  "Ooty":                { lat: 11.4102, lng: 76.6950 },
  /* Hyderabad nearby */
  "Warangal":            { lat: 17.9784, lng: 79.5941 },
  "Nagarjuna Sagar":     { lat: 16.5738, lng: 79.3132 },
  "Srisailam":           { lat: 16.0793, lng: 78.8682 },
  /* Pune nearby */
  "Lonavala":            { lat: 18.7481, lng: 73.4072 },
  "Mahabaleshwar":       { lat: 17.9237, lng: 73.6586 },
  "Mumbai":              { lat: 19.0760, lng: 72.8777 },
  "Kolhapur":            { lat: 16.7050, lng: 74.2433 },
  /* Chennai nearby */
  "Mahabalipuram":       { lat: 12.6269, lng: 80.1927 },
  "Pondicherry":         { lat: 11.9416, lng: 79.8083 },
  "Tirupati":            { lat: 13.6288, lng: 79.4192 },
  "Vellore":             { lat: 12.9165, lng: 79.1325 },
};

/* haversine formula — returns km as a string */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* open Google Maps directions from user location to destination */
function openDestMap(destName, userCoords) {
  const coords = DEST_COORDS[destName];
  const dest = coords
    ? `${coords.lat},${coords.lng}`
    : encodeURIComponent(destName);

  if (userCoords) {
    const origin = `${userCoords.lat},${userCoords.lng}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer"
    );
  } else {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer"
    );
  }
}

/* open Google Maps for a place inside the city */
function openPlaceMap(name, area, city) {
  const query = encodeURIComponent(`${name} ${area} ${city} India`);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${query}`,
    "_blank",
    "noopener,noreferrer"
  );
}

/* ─── MAP MODAL ─── */
function MapModal({ place, city, isNearby, userCoords, onClose }) {
  let embedSrc;
  if (isNearby) {
    const coords = DEST_COORDS[place.name];
    if (userCoords && coords) {
      // show driving route from user → destination
      embedSrc = `https://maps.google.com/maps?saddr=${userCoords.lat},${userCoords.lng}&daddr=${coords.lat},${coords.lng}&output=embed`;
    } else if (coords) {
      embedSrc = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&output=embed&z=12`;
    } else {
      embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(place.name)}&output=embed&z=12`;
    }
  } else {
    const query = encodeURIComponent(`${place.name} ${place.area || ""} ${city} India`);
    embedSrc = `https://maps.google.com/maps?q=${query}&output=embed&z=15`;
  }

  const handleOpen = () =>
    isNearby
      ? openDestMap(place.name, userCoords)
      : openPlaceMap(place.name, place.area || "", city);

  return (
    <div className="ec-modal-overlay" onClick={onClose}>
      <div className="ec-modal" onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className="ec-modal-header">
          <div className="ec-modal-header-left">
            <div className="ec-modal-icon">{isNearby ? "🚗" : "📍"}</div>
            <div>
              <div className="ec-modal-title">{place.name}</div>
              <div className="ec-modal-sub">
                {isNearby
                  ? (place.realDist
                      ? `${place.realDist} km from your location`
                      : place.distance)
                  : `${place.area}, ${city}`}
              </div>
            </div>
          </div>
          <button className="ec-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* map */}
        <div className="ec-modal-map">
          <div className="ec-modal-map-label">
            <span className="ec-modal-map-dot" />
            {isNearby && userCoords ? "Route from your location" : "Live Map"}
          </div>
          <iframe
            title={place.name}
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* description */}
        {place.desc && (
          <div className="ec-modal-desc">{place.desc}</div>
        )}

        {/* footer */}
        <div className="ec-modal-footer">
          <button className="ec-modal-gmaps-btn" onClick={handleOpen}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            {isNearby ? "Get Directions" : "Open in Google Maps"}
          </button>
          <button className="ec-modal-cancel-btn" onClick={onClose}>Done</button>
        </div>

      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function ExploreCity() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const city = searchParams.get("city") || "Delhi";

  const [activeCategory, setActiveCategory] = useState("food");
  const [search, setSearch] = useState("");
  const [modalPlace, setModalPlace] = useState(null);
  const [isNearby, setIsNearby] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  /* get user location once */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserCoords(null),
        { timeout: 8000 }
      );
    }
  }, []);

  const cityData = exploreData[city] || exploreData["Delhi"];
  const catMeta  = categoryMeta.find(c => c.key === activeCategory);
  const rawList  = cityData[activeCategory] || [];
  const filtered = rawList.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.area.toLowerCase().includes(search.toLowerCase())
  );

  /* inject real distances into nearby if user location is available */
  const nearbyWithDist = (cityData.nearby || []).map(p => {
    const coords = DEST_COORDS[p.name];
    if (userCoords && coords) {
      const km = haversineKm(userCoords.lat, userCoords.lng, coords.lat, coords.lng);
      return { ...p, realDist: km };
    }
    return p;
  });

  const openModal = (place, nearby = false) => {
    setModalPlace(place);
    setIsNearby(nearby);
  };

  return (
    <div className="ec-page">

      {/* TOP BAR */}
      <div className="ec-topbar">
        <button className="ec-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="ec-topbar-center">
          <span className="ec-city-badge">
            <span className="ec-city-dot" />{city}
          </span>
        </div>
        <div className="ec-topbar-right" />
      </div>

      {/* HERO */}
      <div className="ec-hero">
        <div className="ec-hero-inner">
          <p className="ec-hero-sup">Explore</p>
          <h1 className="ec-hero-title">{city}</h1>
          <p className="ec-hero-sub">
            Food, culture, faith &amp; hidden gems — all in one place
          </p>
        </div>
      </div>

      <div className="ec-body">

        {/* CATEGORIES */}
        <section className="ec-section">
          <div className="ec-section-header">
            <h2 className="ec-section-title">What are you looking for?</h2>
            <p className="ec-section-sub">Choose a category to explore</p>
          </div>
          <ExploreCategory
            city={city}
            selected={activeCategory}
            onSelect={key => { setActiveCategory(key); setSearch(""); }}
          />
        </section>

        {/* LISTING */}
        <section className="ec-section ec-list-section">
          <div className="ec-list-header">
            <div>
              <h2 className="ec-section-title">
                <span style={{ color: catMeta?.color }}>{catMeta?.icon}</span>
                {" "}{catMeta?.label} in {city}
              </h2>
              <p className="ec-section-sub">
                {filtered.length} places · tap any card to see on map
              </p>
            </div>
            <div className="ec-search-wrap">
              <span className="ec-search-icon">🔍</span>
              <input
                className="ec-search"
                type="text"
                placeholder="Search places..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="ec-search-clear" onClick={() => setSearch("")}>✕</button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="ec-empty">
              <div className="ec-empty-icon">🔍</div>
              <p>No places found{search ? ` for "${search}"` : ` in this category for ${city}`}</p>
            </div>
          ) : (
            <div className="ec-list">
              {filtered.map((place, i) => (
                <div
                  className="ec-list-item"
                  key={i}
                  style={{ animationDelay: `${i * 0.05}s`, "--cat-color": catMeta?.color || "#1976d2" }}
                  onClick={() => openModal(place, false)}
                >
                  {/* number badge */}
                  <div
                    className="ec-list-num"
                    style={{
                      background: (catMeta?.color || "#1976d2") + "18",
                      color: catMeta?.color || "#1976d2",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* content */}
                  <div className="ec-list-content">
                    <div className="ec-list-top">
                      <h3 className="ec-list-name">{place.name}</h3>
                      <span className="ec-list-area">📍 {place.area}</span>
                    </div>
                    <p className="ec-list-desc">{place.desc}</p>
                    <div className="ec-list-cta">
                      <span className="ec-list-cta-map">🗺️ View on map</span>
                      <span
                        className="ec-list-cta-open"
                        onClick={e => {
                          e.stopPropagation();
                          openPlaceMap(place.name, place.area, city);
                        }}
                      >
                        Open in Google Maps ↗
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NEARBY / DAY TRIPS */}
        <section className="ec-section">
          <div className="ec-section-header">
            <h2 className="ec-section-title">🚗 Day Trips from {city}</h2>
            <p className="ec-section-sub">
              {userCoords
                ? "Distances calculated from your current location"
                : "Allow location access for real distances · tap any card to explore"}
            </p>
          </div>

          <div className="ec-nearby-grid">
            {nearbyWithDist.map((place, i) => (
              <div
                className="ec-nearby-card"
                key={i}
                onClick={() => openModal(place, true)}
              >
                <div className="ec-nearby-top">
                  <div className="ec-nearby-name">{place.name}</div>
                  <div className="ec-nearby-dist">
                    🚗{" "}
                    {place.realDist
                      ? `${place.realDist} km`
                      : place.distance}
                  </div>
                </div>
                <p className="ec-nearby-desc">{place.desc}</p>
                <div className="ec-nearby-footer">
                  <span className="ec-nearby-map-hint">Tap to view map</span>
                  <span
                    className="ec-nearby-open"
                    onClick={e => { e.stopPropagation(); openDestMap(place.name, userCoords); }}
                  >
                    Get Directions ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <div className="ec-footer">
        <p>© 2025 CampusOrbit · Explore more cities on our platform 💫</p>
      </div>

      {/* MAP MODAL */}
      {modalPlace && (
        <MapModal
          place={modalPlace}
          city={city}
          isNearby={isNearby}
          userCoords={userCoords}
          onClose={() => { setModalPlace(null); setIsNearby(false); }}
        />
      )}

    </div>
  );
}
