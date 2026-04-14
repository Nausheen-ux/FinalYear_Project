

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
  { type: "Police", name: "Lalbazar Police Station", contact: "033-22143230, 033-22143024" },
  { type: "Police", name: "Jadavpur Police Station", contact: "9433918327" },
  { type: "Police", name: "West Bengal Control Room", contact: "033-22215486, 22215415" },
  { type: "Police", name: "Traffic Control Room", contact: "033-22143644, 033-22145000" },
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
  { type: "Blood Bank", name: "Lions Districts 322 B1 Blood Bank", contact: "033-22485778, 033-22485780" },
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
  ],

  mumbai:[
  { type: "Police", name: "Mumbai Police Control Room", contact: "100" },
  { type: "Police", name: "Mumbai Police HQ", contact: "022-22620111" },
  { type: "Cyber Security", name: "National Cyber Crime Helpline", contact: "1930" },
  { type: "Control Room", name: "Disaster Management Mumbai", contact: "022-22027990" },
  { type: "Fire", name: "Mumbai Fire Brigade", contact: "101" },
  { type: "Ambulance", name: "Emergency Ambulance", contact: "108" },
  { type: "Medical", name: "Emergency Medical Helpline", contact: "102" },
  { type: "Women", name: "Women Helpline", contact: "1091" },
  { type: "Child", name: "Child Helpline", contact: "1098" },
  { type: "Traffic", name: "Mumbai Traffic Police", contact: "022-24937710" },
  { type: "Anti Poison", name: "Poison Control", contact: "022-23735555" },
  { type: "Hospital", name: "KEM Hospital", contact: "022-24107000" },
  { type: "Hospital", name: "JJ Hospital", contact: "022-23735555" },
  { type: "Hospital", name: "Nair Hospital", contact: "022-23027000" },
  { type: "Hospital", name: "Lilavati Hospital", contact: "022-26751000" },
  { type: "Hospital", name: "Kokilaben Dhirubhai Ambani Hospital", contact: "022-42696969" },
  { type: "Hospital", name: "Fortis Hospital Mulund", contact: "022-67994444" },
  { type: "Blood Bank", name: "Tata Memorial Blood Bank", contact: "022-24177000" },
  { type: "Blood Bank", name: "KEM Blood Bank", contact: "022-24107000" },
  { type: "Government", name: "BMC Helpline", contact: "1916" },
  { type: "Municipal", name: "BMC Control Room", contact: "022-22694725" },
  { type: "Electricity", name: "BEST Electricity", contact: "1912" },
  { type: "Water", name: "Water Supply BMC", contact: "1916" },
  { type: "Animal", name: "SPCA Mumbai", contact: "022-23806060" },
  { type: "Development", name: "Mumbai Metropolitan Region Development Authority", contact: "022-26597400" }
  ],

  delhi:[
  { type: "Police", name: "Delhi Police Control Room", contact: "100" },
  { type: "Cyber Security", name: "National Cyber Crime Helpline", contact: "1930" },
  { type: "Control Room", name: "Delhi Disaster Management", contact: "1077" },
  { type: "Fire", name: "Delhi Fire Service", contact: "101" },
  { type: "Ambulance", name: "Ambulance Service", contact: "102" },
  { type: "Women", name: "Women Helpline", contact: "181" },
  { type: "Child", name: "Child Helpline", contact: "1098" },
  { type: "Traffic", name: "Delhi Traffic Police", contact: "1095" },
  { type: "Anti Poison", name: "Poison Control AIIMS", contact: "011-26593677" },
  { type: "Hospital", name: "AIIMS Delhi", contact: "011-26588500" },
  { type: "Hospital", name: "Safdarjung Hospital", contact: "011-26707444" },
  { type: "Hospital", name: "LNJP Hospital", contact: "011-23232400" },
  { type: "Hospital", name: "Apollo Hospital Delhi", contact: "011-71791090" },
  { type: "Hospital", name: "Fortis Escorts Hospital", contact: "011-47135000" },
  { type: "Blood Bank", name: "Red Cross Blood Bank", contact: "011-23359322" },
  { type: "Government", name: "Delhi Govt Helpline", contact: "1031" },
  { type: "Municipal", name: "MCD Helpline", contact: "155305" },
  { type: "Electricity", name: "Electricity Complaint", contact: "1912" },
  { type: "Water", name: "Delhi Jal Board", contact: "1916" },
  { type: "Animal", name: "Animal Helpline Delhi", contact: "011-23890351" }
  ],

  bangalore:[
  { type: "Police", name: "Bangalore Police Control Room", contact: "100" },
  { type: "Cyber Security", name: "Cyber Crime Helpline", contact: "1930" },
  { type: "Control Room", name: "Disaster Management", contact: "1077" },
  { type: "Fire", name: "Fire Service", contact: "101" },
  { type: "Ambulance", name: "Ambulance", contact: "108" },
  { type: "Women", name: "Women Helpline", contact: "1091" },
  { type: "Traffic", name: "Traffic Police", contact: "080-25588444" },
  { type: "Hospital", name: "Victoria Hospital", contact: "080-26701150" },
  { type: "Hospital", name: "Bowring Hospital", contact: "080-25591325" },
  { type: "Hospital", name: "Manipal Hospital", contact: "080-25024444" },
  { type: "Hospital", name: "Apollo Hospital Bangalore", contact: "080-26304050" },
  { type: "Hospital", name: "Fortis Hospital Bangalore", contact: "080-66214444" },
  { type: "Blood Bank", name: "Indian Red Cross Blood Bank", contact: "080-22268435" },
  { type: "Municipal", name: "BBMP Helpline", contact: "080-22660000" },
  { type: "Electricity", name: "BESCOM", contact: "1912" },
  { type: "Water", name: "BWSSB", contact: "1916" },
  { type: "Animal", name: "Animal Helpline Bangalore", contact: "080-22943333" }
  ],

  chennai:[
  { type: "Police", name: "Chennai Police", contact: "100" },
  { type: "Cyber Security", name: "Cyber Crime", contact: "1930" },
  { type: "Fire", name: "Fire Service", contact: "101" },
  { type: "Ambulance", name: "Ambulance", contact: "108" },
  { type: "Women", name: "Women Helpline", contact: "1091" },
  { type: "Traffic", name: "Traffic Police", contact: "044-28447700" },
  { type: "Hospital", name: "Rajiv Gandhi Govt Hospital", contact: "044-25305000" },
  { type: "Hospital", name: "Stanley Medical College Hospital", contact: "044-25281347" },
  { type: "Hospital", name: "Apollo Hospital Chennai", contact: "044-28290200" },
  { type: "Hospital", name: "Fortis Malar Hospital", contact: "044-42892222" },
  { type: "Blood Bank", name: "Government Blood Bank Chennai", contact: "044-25305000" },
  { type: "Municipal", name: "Chennai Corporation", contact: "1913" },
  { type: "Electricity", name: "TNEB", contact: "1912" },
  { type: "Water", name: "Metro Water", contact: "044-45674567" }
  ],

  hyderabad:[
  { type: "Police", name: "Hyderabad Police", contact: "100" },
  { type: "Cyber Security", name: "Cyber Crime", contact: "1930" },
  { type: "Fire", name: "Fire Service", contact: "101" },
  { type: "Ambulance", name: "Ambulance", contact: "108" },
  { type: "Women", name: "Women Helpline", contact: "181" },
  { type: "Hospital", name: "Osmania Hospital", contact: "040-24600121" },
  { type: "Hospital", name: "Gandhi Hospital", contact: "040-27505566" },
  { type: "Hospital", name: "Apollo Hospital Hyderabad", contact: "040-23607777" },
  { type: "Hospital", name: "Yashoda Hospital", contact: "040-45674567" },
  { type: "Blood Bank", name: "Red Cross Hyderabad", contact: "040-24745200" },
  { type: "Municipal", name: "GHMC", contact: "040-21111111" },
  { type: "Electricity", name: "Electricity Complaint", contact: "1912" },
  { type: "Water", name: "Water Supply", contact: "155313" }
  ],

  pune:[
  { type: "Police", name: "Pune Police", contact: "100" },
  { type: "Cyber Security", name: "Cyber Crime", contact: "1930" },
  { type: "Fire", name: "Fire Service", contact: "101" },
  { type: "Ambulance", name: "Ambulance", contact: "108" },
  { type: "Hospital", name: "Sassoon Hospital", contact: "020-26128000" },
  { type: "Hospital", name: "Jehangir Hospital", contact: "020-66819999" },
  { type: "Hospital", name: "Ruby Hall Clinic", contact: "020-26163391" },
  { type: "Blood Bank", name: "Sassoon Blood Bank", contact: "020-26128000" },
  { type: "Municipal", name: "Pune Municipal Corporation", contact: "18001030222" },
  { type: "Electricity", name: "MSEDCL", contact: "1912" },
  { type: "Water", name: "Water Supply Pune", contact: "020-25650200" }
  ]
};

/* splits "033-22143230, 033-22143024" → ["033-22143230", "033-22143024"] */
function splitNumbers(contact) {
  return contact.split(",").map(n => n.trim()).filter(Boolean);
}

/* strips spaces/dashes for the href but keeps display as-is */
function toTelHref(num) {
  return `tel:${num.replace(/[\s]/g, "")}`;
}

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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Category buttons */}
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

          {/* Contact list */}
          {selectedType && (
            <div className="contact-display">
              <h3>{selectedType}</h3>
              {groupedContacts[selectedType].map((c, i) => {
                const numbers = splitNumbers(c.contact);
                return (
                  <div key={i} className="contact-card">
                    <p className="c-name">{c.name}</p>
                    <div className="c-numbers">
                      {numbers.map((num, idx) => (
                        <a
                          key={idx}
                          href={toTelHref(num)}
                          className="c-number-link"
                          title={`Call ${num}`}
                        >
                          <span className="c-dial-icon">📞</span>
                          {num}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* No data message */}
      {searched && contacts.length === 0 && (
        <p className="no-data">No emergency contacts available for this city.</p>
      )}
    </div>
  );
}
