

import React, { useState } from "react";
import "../style/EmergencyContacts.css";

const EMERGENCY_DATA = {
  kolkata:[
  { type: "Cyber Security", name: "National Cyber Security Helpline", contact: "1075" },
  { type: "Cyber Security", name: "Cyber Head (Kolkata)", contact: "011-23978046" },
  { type: "Control Room", name: "State Control Room", contact: "033-23571075, 1083, 3636" },
  { type: "Police", name: "Police Helpline", contact: "100" },
  { type: "Fire", name: "Fire Brigade", contact: "101" },
  { type: "Ambulance", name: "Emergency Ambulance", contact: "102" },
  { type: "Medical", name: "Medical Helpline", contact: "9830079999" },
  { type: "Senior Citizen", name: "Senior Citizen Helpline", contact: "9830088884" },
  { type: "Child", name: "Child Helpline", contact: "1098" },
  { type: "Women", name: "Women Helpline", contact: "1091" },
  { type: "Traffic", name: "Traffic Helpline", contact: "1073" },
  { type: "Anti Poison", name: "AIIMS Anti-Poison Centre", contact: "011-26593677, 26589391" },
  { type: "Anti Poison", name: "R.G. Kar Hospital Anti-Poison", contact: "18003450033" },
  { type: "Police", name: "Lalbazar Police Station", contact: "033-22143230/3024" },
  { type: "Police", name: "Jadavpur Police Station", contact: "9433918327" },
  { type: "Police", name: "West Bengal Control Room", contact: "033-22215486, 22215415" },
  { type: "Police", name: "Traffic Control Room", contact: "033-22143644/5000" },
  { type: "Police", name: "Police Commissioner Office", contact: "033-22256060" },
  { type: "Police", name: "Airport Police Station", contact: "033-25118292" },
  { type: "Police", name: "Alipore Police Station", contact: "033-24791021, 24080100" },
  { type: "Police", name: "Gariahat Police Station", contact: "033-24863702, 24863703" },
  { type: "Police", name: "Burrabazar Police Station", contact: "033-22687554, 22683802" },
  { type: "Police", name: "Park Street Police Station", contact: "033-22268321, 22832100" },
  { type: "Blood Bank", name: "Central Blood Bank", contact: "033-23510620, 23510619" },
  { type: "Blood Bank", name: "Hemophilia Society Blood Bank", contact: "033-24263739, 24264273" },
  { type: "Blood Bank", name: "Life Care Blood Bank", contact: "033-22842298" },
  { type: "Blood Bank", name: "Bhoruka Blood Bank", contact: "033-22658092, 22174019" },
  { type: "Blood Bank", name: "People Blood Bank", contact: "033-24555164, 24555557" },
  { type: "Blood Bank", name: "Ashok Blood Bank", contact: "033-24720333" },
  { type: "Blood Bank", name: "Lions Districts 322 B1 Blood Bank", contact: "033-22485778/5780" },
  { type: "Blood Bank", name: "Indian Blood Bank", contact: "9038010972, 033-23730138" },
  { type: "Fire", name: "Fire Station HQ", contact: "033-22440101, 033-22440163" },
  { type: "Fire", name: "Behala Fire Station", contact: "033-24672085" },
  { type: "Fire", name: "Baisnabghata Fire Station", contact: "033-24360685" },
  { type: "Fire", name: "Central Avenue Fire Station", contact: "033-22414545, 22414546" },
  { type: "Fire", name: "Dumdum Fire Station", contact: "033-25514309" },
  { type: "Fire", name: "Kalighat Fire Station", contact: "033-22440101" },
  { type: "Fire", name: "Salt Lake Fire Station", contact: "033-23575293" },
  { type: "Fire", name: "Tollygunge Fire Station", contact: "033-24115393" },
  { type: "Ambulance", name: "St. Johns Ambulance", contact: "9830023653, 033-24863926, 033-24761935" },
  { type: "Ambulance", name: "Healthcare", contact: "033-24150600" },
  { type: "Ambulance", name: "Relief Medical Services", contact: "033-24754169" },
  { type: "Ambulance", name: "Lifecare Medical Services", contact: "033-24754628" },
  { type: "Ambulance", name: "Dhanwantry", contact: "033-24495594" },
  { type: "Government", name: "Chief Minister Office", contact: "033-22145555, 22145588" },
  { type: "Municipal", name: "Kolkata Municipal Corporation", contact: "1600333375" },
  { type: "Utility", name: "Gas Leakage (North/Central)", contact: "033-22415363, 22415579" }, 
  { type: "Utility", name: "Gas Leakage (South)", contact: "033-24118718, 24113792" },
  { type: "Utility", name: "Dead Animal Removal", contact: "033-22445112" },
  { type: "Animal", name: "Animal Ambulance (Happy Hearts NGO)", contact: "6289770078, 9836162918" },
  { type: "Development", name: "New Town Kolkata Development Authority", contact: "1800-103-7652" }
]

  // add more cities here later
};

export default function EmergencyContacts() {
  const [city, setCity] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const cityKey = city.trim().toLowerCase();
    if (!cityKey) {
      alert("Please enter a city first!");
      return;
    }
    if (EMERGENCY_DATA[cityKey]) {
      setContacts(EMERGENCY_DATA[cityKey]);
      setSearched(true);
      setSelectedType(null);
    } else {
      alert("No emergency data found for this city yet.");
      setContacts([]);
      setSearched(true);
      setSelectedType(null);
    }
  };

  const groupedContacts = contacts.reduce((acc, cur) => {
    acc[cur.type] = acc[cur.type] ? [...acc[cur.type], cur] : [cur];
    return acc;
  }, {});

  const serviceTypes = Object.keys(groupedContacts);

  const handleTypeClick = (type) => {
    setSelectedType(selectedType === type ? null : type);
  };

  return (
    <div className="emergency-page">
      <h2>🚨 Emergency Contacts</h2>
      <p className="sub">Enter your city to see emergency services nearby.</p>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter your city (e.g., Kolkata)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Only show buttons AFTER user searches */}
      {searched && contacts.length > 0 && (
        <>
          <div className="button-grid">
            {serviceTypes.map((type) => (
              <button
                key={type}
                className={`grid-btn ${selectedType === type ? "active" : ""}`}
                onClick={() => handleTypeClick(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {selectedType && (
            <div className="contact-display">
              <h3>{selectedType}</h3>
              {groupedContacts[selectedType].map((c, i) => (
                <div key={i} className="contact-card">
                  <p className="c-name">{c.name}</p>
                  <p className="c-number">{c.contact}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Message when searched but no contacts found */}
      {searched && contacts.length === 0 && (
        <p className="no-data">No emergency contacts available for this city.</p>
      )}
    </div>
  );
}
