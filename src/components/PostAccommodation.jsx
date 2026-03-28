import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";

export default function PostAccommodation() {
  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    propertyType: "",
    buildingName: "",
    address: "",
    roomType: [],
    furnishType: "",
    price: "",
    mobile: "",
    email: "",
    images: [],
    colleges: [{ name: "", distance: "" }],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const newRoomType = checked
          ? [...prev.roomType, value]
          : prev.roomType.filter((item) => item !== value);
        return { ...prev, roomType: newRoomType };
      });
    } else if (type === "file") {
      const uploadedFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedFiles],
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCollegeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedColleges = [...formData.colleges];
    updatedColleges[index][name] = value;
    setFormData({ ...formData, colleges: updatedColleges });
  };

  const addCollege = () => {
    setFormData({
      ...formData,
      colleges: [...formData.colleges, { name: "", distance: "" }],
    });
  };

  const removeCollege = (index) => {
    const updatedColleges = formData.colleges.filter((_, i) => i !== index);
    setFormData({ ...formData, colleges: updatedColleges });
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const validate = () => {
    let tempErrors = {};
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mobileRegex.test(formData.mobile))
      tempErrors.mobile = "Enter a valid 10-digit mobile number";

    if (!emailRegex.test(formData.email))
      tempErrors.email = "Enter a valid email address";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("city", formData.city);
      data.append("propertyType", formData.propertyType);
      data.append("buildingName", formData.buildingName);
      data.append("address", formData.address);
      data.append("furnishType", formData.furnishType);
      data.append("price", formData.price);
      data.append("mobile", formData.mobile);
      data.append("email", formData.email);
      const ownerId = localStorage.getItem("userId");
 data.append("ownerId", ownerId); // replace with actual logged-in user ID
      data.append("roomType", JSON.stringify(formData.roomType));
      data.append("colleges", JSON.stringify(formData.colleges));
      formData.images.forEach((file) => {
        data.append("images", file);
      });

      const response = await axios.post(
        "http://localhost:5000/api/accommodation",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(response.data.message);

      // Reset form
      setFormData({
        fullName: "",
        city: "",
        propertyType: "",
        buildingName: "",
        address: "",
        roomType: [],
        furnishType: "",
        price: "",
        mobile: "",
        email: "",
        images: [],
        colleges: [{ name: "", distance: "" }],
      });
    } catch (error) {
      console.error("Error posting accommodation:", error);
      alert(
        error.response?.data?.message || "Error posting accommodation. Try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const [ownerName, setOwnerName] = useState("");
  useEffect(() => {
     const name = localStorage.getItem("ownerName") || 
                  localStorage.getItem("userName") || 
                  "Owner";
     setOwnerName(name);
   }, []);


  return (
    <div
      style={{
        backgroundColor: "#fff9e6",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <nav
  className="navbar navbar-expand-lg navbar-dark bg-violet px-3 py-1 fixed-top"
  style={{ backgroundColor: "#5a2ca0" }}
>
  <div className="container-fluid">
    {/* Static title instead of clickable logo */}
    <span className="navbar-brand mb-0 h1">Owner's Dashboard</span>

    <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
      {/* Owner profile icon and name */}
      <div className="d-flex align-items-center me-3">
        <span className="text-white me-2">{ownerName || "Owner"}</span> {/* Replace with dynamic owner name */}
        <i
          className="bi bi-person-circle text-white"
          style={{ fontSize: "1.5rem" }}
        ></i>
      </div>

      {/* Dropdown */}
      <div className="dropdown">
        <button
          className="btn btn-outline-light dropdown-toggle"
          type="button"
          id="profileMenu"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Profile
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="profileMenu"
        >
          {/* <li>
            <Link className="dropdown-item" to="/my-profile">
              My Profile
            </Link>
          </li> */}
          <li>
            <Link className="dropdown-item" to="/posted-properties">
              Posted Properties
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>


      <div className="container flex-grow-1 d-flex justify-content-center align-items-start py-4">
        <div
          className="card shadow-lg p-4 w-100"
          style={{ maxWidth: "700px", backgroundColor: "white" }}
        >
          <h3 className="text-center mb-4">Post Your Accommodation</h3>
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Property Type */}
            <div className="mb-3">
              <label className="form-label">Property Type *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent House</option>
                <option value="Independent Floor">Independent Floor</option>
              </select>
            </div>

            {/* Building Name */}
            <div className="mb-3">
              <label className="form-label">Building/Society Name *</label>
              <input
                type="text"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                required
              ></textarea>
            </div>

            {/* Mobile */}
            <div className="mb-3">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                placeholder="Enter 10-digit mobile number"
                required
              />
              {errors.mobile && (
                <div className="invalid-feedback">{errors.mobile}</div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Colleges */}
            <div className="mb-3">
              <label className="form-label">Nearest College(s) & Distance</label>
              {formData.colleges.map((college, index) => (
                <div className="row mb-2 align-items-center" key={index}>
                  <div className="col-md-5">
                    <input
                      type="text"
                      name="name"
                      placeholder="College/University Name"
                      value={college.name}
                      onChange={(e) => handleCollegeChange(index, e)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      name="distance"
                      placeholder="Distance (km)"
                      value={college.distance}
                      onChange={(e) => handleCollegeChange(index, e)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-2 text-end">
                    {formData.colleges.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeCollege(index)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={addCollege}
              >
                ➕ Add More
              </button>
            </div>

            {/* Room Type */}
            <div className="mb-3">
              <label className="form-label">Room Type *</label>
              <div className="d-flex flex-wrap">
                {["Sharing", "1BHK", "2BHK", "3BHK"].map((type) => (
                  <div className="form-check me-3" key={type}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="roomType"
                      value={type}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Furnish Type */}
            <div className="mb-3">
              <label className="form-label">Furnish Type *</label>
              <div className="d-flex flex-wrap">
                {["Furnished", "Semi-Furnished", "Unfurnished"].map((type) => (
                  <div className="form-check me-3" key={type}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="furnishType"
                      value={type}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Images */}
            <div className="mb-3">
              <label className="form-label">Upload Images</label>
              <input
                type="file"
                name="images"
                className="form-control"
                onChange={handleChange}
                multiple
              />
              <div className="mt-2 d-flex flex-wrap">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="position-relative me-2 mb-2"
                    style={{ display: "inline-block" }}
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-close position-absolute top-0 end-0"
                      aria-label="Remove"
                      onClick={() => removeImage(idx)}
                    ></button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Posting..." : "Post Accommodation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}








// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

//   :root {
//     --primary:     #5a2ca0;
//     --primary-lt:  #7c4dbb;
//     --primary-pale:#f3eeff;
//     --accent:      #ff6b35;
//     --success:     #22c55e;
//     --danger:      #ef4444;
//     --bg:          #f7f5ff;
//     --surface:     #ffffff;
//     --border:      #e8e0f5;
//     --text:        #1e1333;
//     --muted:       #7b6fa0;
//     --shadow:      0 4px 24px rgba(90,44,160,0.10);
//     --shadow-lg:   0 12px 40px rgba(90,44,160,0.16);
//   }

//   * { box-sizing: border-box; margin: 0; padding: 0; }

//   .pa-root {
//     font-family: 'DM Sans', sans-serif;
//     background: var(--bg);
//     min-height: 100vh;
//     color: var(--text);
//   }

//   /* ── NAVBAR ── */
//   .pa-nav {
//     position: sticky;
//     top: 0;
//     z-index: 200;
//     background: var(--primary);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 0 clamp(16px, 4vw, 40px);
//     height: 62px;
//     box-shadow: 0 2px 18px rgba(90,44,160,0.25);
//   }

//   .pa-nav-brand {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//   }

//   .pa-nav-brand-icon {
//     width: 34px;
//     height: 34px;
//     background: rgba(255,255,255,0.18);
//     border-radius: 10px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 1rem;
//   }

//   .pa-nav-title {
//     font-family: 'Playfair Display', serif;
//     font-size: clamp(1rem, 3vw, 1.2rem);
//     color: #fff;
//     letter-spacing: 0.3px;
//   }

//   .pa-nav-right {
//     display: flex;
//     align-items: center;
//     gap: clamp(8px, 2vw, 18px);
//     flex-wrap: wrap;
//   }

//   .pa-owner-pill {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     background: rgba(255,255,255,0.13);
//     border-radius: 50px;
//     padding: 5px 14px 5px 8px;
//     color: #fff;
//     font-size: 0.85rem;
//     font-weight: 500;
//   }

//   .pa-owner-avatar {
//     width: 28px;
//     height: 28px;
//     background: rgba(255,255,255,0.25);
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 0.85rem;
//   }

//   .pa-nav-btn {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.82rem;
//     font-weight: 600;
//     padding: 6px 16px;
//     border-radius: 8px;
//     cursor: pointer;
//     border: none;
//     transition: all 0.2s;
//     text-decoration: none;
//     display: inline-flex;
//     align-items: center;
//     gap: 5px;
//   }

//   .pa-nav-btn-ghost {
//     background: rgba(255,255,255,0.14);
//     color: #fff;
//   }
//   .pa-nav-btn-ghost:hover { background: rgba(255,255,255,0.24); }

//   .pa-nav-btn-logout {
//     background: rgba(239,68,68,0.18);
//     color: #fca5a5;
//     border: 1px solid rgba(239,68,68,0.3);
//   }
//   .pa-nav-btn-logout:hover {
//     background: rgba(239,68,68,0.32);
//     color: #fff;
//   }

//   /* ── PAGE BODY ── */
//   .pa-body {
//     max-width: 760px;
//     margin: 0 auto;
//     padding: clamp(24px, 5vw, 48px) clamp(16px, 4vw, 24px);
//   }

//   /* Page header */
//   .pa-page-header {
//     text-align: center;
//     margin-bottom: 32px;
//   }

//   .pa-page-header h1 {
//     font-family: 'Playfair Display', serif;
//     font-size: clamp(1.6rem, 5vw, 2.2rem);
//     color: var(--primary);
//     margin-bottom: 6px;
//   }

//   .pa-page-header p {
//     color: var(--muted);
//     font-size: 0.92rem;
//   }

//   /* ── CARD ── */
//   .pa-card {
//     background: var(--surface);
//     border-radius: 20px;
//     box-shadow: var(--shadow);
//     overflow: hidden;
//   }

//   /* Section blocks inside card */
//   .pa-section {
//     padding: clamp(20px, 4vw, 32px);
//     border-bottom: 1px solid var(--border);
//   }

//   .pa-section:last-of-type { border-bottom: none; }

//   .pa-section-label {
//     font-size: 0.7rem;
//     font-weight: 700;
//     letter-spacing: 1.2px;
//     text-transform: uppercase;
//     color: var(--primary-lt);
//     margin-bottom: 18px;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }

//   .pa-section-label::after {
//     content: '';
//     flex: 1;
//     height: 1px;
//     background: var(--border);
//   }

//   /* ── GRID ── */
//   .pa-grid-2 {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 16px;
//   }

//   @media (max-width: 540px) {
//     .pa-grid-2 { grid-template-columns: 1fr; }
//   }

//   .pa-span-2 { grid-column: 1 / -1; }

//   /* ── FIELD ── */
//   .pa-field { display: flex; flex-direction: column; gap: 6px; }

//   .pa-label {
//     font-size: 0.8rem;
//     font-weight: 600;
//     color: var(--text);
//   }

//   .pa-label span { color: var(--accent); margin-left: 2px; }

//   .pa-input, .pa-select, .pa-textarea {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.9rem;
//     color: var(--text);
//     background: var(--bg);
//     border: 1.5px solid var(--border);
//     border-radius: 10px;
//     padding: 10px 14px;
//     transition: border 0.2s, box-shadow 0.2s;
//     outline: none;
//     width: 100%;
//   }

//   .pa-input:focus, .pa-select:focus, .pa-textarea:focus {
//     border-color: var(--primary-lt);
//     box-shadow: 0 0 0 3px rgba(124,77,187,0.12);
//     background: #fff;
//   }

//   .pa-textarea { resize: vertical; min-height: 80px; }

//   .pa-input.error, .pa-select.error { border-color: var(--danger); }

//   .pa-error-msg {
//     font-size: 0.75rem;
//     color: var(--danger);
//     margin-top: -2px;
//   }

//   /* ── CHECKBOXES / RADIOS ── */
//   .pa-options {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 10px;
//     margin-top: 4px;
//   }

//   .pa-option-label {
//     display: flex;
//     align-items: center;
//     gap: 7px;
//     background: var(--bg);
//     border: 1.5px solid var(--border);
//     border-radius: 8px;
//     padding: 7px 14px;
//     cursor: pointer;
//     font-size: 0.85rem;
//     font-weight: 500;
//     transition: all 0.18s;
//     user-select: none;
//   }

//   .pa-option-label:hover { border-color: var(--primary-lt); background: var(--primary-pale); }

//   .pa-option-label input { accent-color: var(--primary); width: 15px; height: 15px; }

//   /* ── COLLEGE ROWS ── */
//   .pa-college-row {
//     display: grid;
//     grid-template-columns: 1fr 1fr auto;
//     gap: 10px;
//     align-items: center;
//     margin-bottom: 10px;
//   }

//   @media (max-width: 480px) {
//     .pa-college-row { grid-template-columns: 1fr; }
//     .pa-college-row .pa-remove-btn { justify-self: start; }
//   }

//   .pa-add-btn {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.8rem;
//     font-weight: 600;
//     color: var(--primary);
//     background: var(--primary-pale);
//     border: 1.5px dashed var(--primary-lt);
//     border-radius: 8px;
//     padding: 7px 16px;
//     cursor: pointer;
//     transition: all 0.18s;
//   }

//   .pa-add-btn:hover { background: #ece4ff; }

//   .pa-remove-btn {
//     width: 32px;
//     height: 32px;
//     border-radius: 8px;
//     border: none;
//     background: #fef2f2;
//     color: var(--danger);
//     cursor: pointer;
//     font-size: 1rem;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: background 0.18s;
//     flex-shrink: 0;
//   }

//   .pa-remove-btn:hover { background: #fee2e2; }

//   /* ── IMAGE UPLOAD ── */
//   .pa-upload-zone {
//     border: 2px dashed var(--border);
//     border-radius: 12px;
//     padding: 22px;
//     text-align: center;
//     cursor: pointer;
//     transition: border 0.2s, background 0.2s;
//     background: var(--bg);
//     position: relative;
//   }

//   .pa-upload-zone:hover { border-color: var(--primary-lt); background: var(--primary-pale); }

//   .pa-upload-zone input[type="file"] {
//     position: absolute;
//     inset: 0;
//     opacity: 0;
//     cursor: pointer;
//     width: 100%;
//     height: 100%;
//   }

//   .pa-upload-icon { font-size: 2rem; margin-bottom: 6px; }
//   .pa-upload-text { font-size: 0.85rem; color: var(--muted); }

//   .pa-image-previews {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 10px;
//     margin-top: 14px;
//   }

//   .pa-img-thumb {
//     position: relative;
//     width: 80px;
//     height: 80px;
//     border-radius: 10px;
//     overflow: hidden;
//     border: 2px solid var(--border);
//   }

//   .pa-img-thumb img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//   }

//   .pa-img-remove {
//     position: absolute;
//     top: 3px;
//     right: 3px;
//     width: 20px;
//     height: 20px;
//     border-radius: 50%;
//     background: rgba(0,0,0,0.55);
//     color: #fff;
//     border: none;
//     cursor: pointer;
//     font-size: 0.65rem;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   /* ── SUBMIT ── */
//   .pa-submit-section {
//     padding: clamp(20px, 4vw, 28px) clamp(20px, 4vw, 32px);
//     background: linear-gradient(135deg, var(--primary-pale), #fff);
//   }

//   .pa-submit-btn {
//     width: 100%;
//     padding: 14px;
//     background: linear-gradient(135deg, var(--primary), var(--primary-lt));
//     color: #fff;
//     border: none;
//     border-radius: 12px;
//     font-family: 'DM Sans', sans-serif;
//     font-size: 1rem;
//     font-weight: 700;
//     cursor: pointer;
//     transition: transform 0.2s, box-shadow 0.2s;
//     box-shadow: 0 4px 16px rgba(90,44,160,0.3);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 8px;
//   }

//   .pa-submit-btn:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 24px rgba(90,44,160,0.38);
//   }

//   .pa-submit-btn:disabled {
//     opacity: 0.65;
//     cursor: not-allowed;
//   }

//   /* spinner */
//   .pa-spinner {
//     width: 18px;
//     height: 18px;
//     border: 2.5px solid rgba(255,255,255,0.4);
//     border-top-color: #fff;
//     border-radius: 50%;
//     animation: spin 0.7s linear infinite;
//   }

//   @keyframes spin { to { transform: rotate(360deg); } }
// `;

// export default function PostAccommodation() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     city: "",
//     propertyType: "",
//     buildingName: "",
//     address: "",
//     roomType: [],
//     furnishType: "",
//     price: "",
//     mobile: "",
//     email: "",
//     images: [],
//     colleges: [{ name: "", distance: "" }],
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [ownerName, setOwnerName] = useState("");

//   useEffect(() => {
//     const name =
//       localStorage.getItem("ownerName") ||
//       localStorage.getItem("userName") ||
//       "Owner";
//     setOwnerName(name);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === "checkbox") {
//       setFormData((prev) => ({
//         ...prev,
//         roomType: checked
//           ? [...prev.roomType, value]
//           : prev.roomType.filter((i) => i !== value),
//       }));
//     } else if (type === "file") {
//       setFormData((prev) => ({
//         ...prev,
//         images: [...prev.images, ...Array.from(files)],
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCollegeChange = (index, e) => {
//     const { name, value } = e.target;
//     const updated = [...formData.colleges];
//     updated[index][name] = value;
//     setFormData((prev) => ({ ...prev, colleges: updated }));
//   };

//   const addCollege = () =>
//     setFormData((prev) => ({
//       ...prev,
//       colleges: [...prev.colleges, { name: "", distance: "" }],
//     }));

//   const removeCollege = (index) =>
//     setFormData((prev) => ({
//       ...prev,
//       colleges: prev.colleges.filter((_, i) => i !== index),
//     }));

//   const removeImage = (index) =>
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));

//   const validate = () => {
//     const errs = {};
//     if (!/^[0-9]{10}$/.test(formData.mobile))
//       errs.mobile = "Enter a valid 10-digit mobile number";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       errs.email = "Enter a valid email address";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     try {
//       setLoading(true);
//       const data = new FormData();
//       Object.entries({
//         fullName: formData.fullName,
//         city: formData.city,
//         propertyType: formData.propertyType,
//         buildingName: formData.buildingName,
//         address: formData.address,
//         furnishType: formData.furnishType,
//         price: formData.price,
//         mobile: formData.mobile,
//         email: formData.email,
//         ownerId: localStorage.getItem("userId"),
//         roomType: JSON.stringify(formData.roomType),
//         colleges: JSON.stringify(formData.colleges),
//       }).forEach(([k, v]) => data.append(k, v));
//       formData.images.forEach((f) => data.append("images", f));

//       const res = await axios.post(
//         "http://localhost:5000/api/accommodation",
//         data,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       alert(res.data.message);
//       setFormData({
//         fullName: "", city: "", propertyType: "", buildingName: "",
//         address: "", roomType: [], furnishType: "", price: "",
//         mobile: "", email: "", images: [],
//         colleges: [{ name: "", distance: "" }],
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || "Error posting accommodation. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="pa-root">

//         {/* ── NAVBAR ── */}
//         <nav className="pa-nav">
//           <div className="pa-nav-brand">
//             <div className="pa-nav-brand-icon">🏠</div>
//             <span className="pa-nav-title">Owner's Dashboard</span>
//           </div>

//           <div className="pa-nav-right">
//             {/* Owner pill */}
//             <div className="pa-owner-pill">
//               <div className="pa-owner-avatar">👤</div>
//               {ownerName}
//             </div>

//             {/* Posted properties */}
//             <Link
//               to="/posted-properties"
//               className="pa-nav-btn pa-nav-btn-ghost"
//               style={{ textDecoration: "none" }}
//             >
//               📋 My Listings
//             </Link>

//             {/* Logout */}
//             <button
//               className="pa-nav-btn pa-nav-btn-logout"
//               onClick={handleLogout}
//             >
//               🚪 Logout
//             </button>
//           </div>
//         </nav>

//         {/* ── BODY ── */}
//         <div className="pa-body">
//           <div className="pa-page-header">
//             <h1>Post Your Accommodation</h1>
//             <p>Fill in the details below and reach thousands of students instantly.</p>
//           </div>

//           <div className="pa-card">
//             <form onSubmit={handleSubmit}>

//               {/* ── OWNER INFO ── */}
//               <div className="pa-section">
//                 <div className="pa-section-label">Owner Information</div>
//                 <div className="pa-grid-2">
//                   <div className="pa-field pa-span-2">
//                     <label className="pa-label">Full Name <span>*</span></label>
//                     <input
//                       className="pa-input"
//                       type="text"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleChange}
//                       placeholder="Your full name"
//                       required
//                     />
//                   </div>

//                   <div className="pa-field">
//                     <label className="pa-label">Mobile Number <span>*</span></label>
//                     <input
//                       className={`pa-input ${errors.mobile ? "error" : ""}`}
//                       type="tel"
//                       name="mobile"
//                       value={formData.mobile}
//                       onChange={handleChange}
//                       placeholder="10-digit number"
//                       required
//                     />
//                     {errors.mobile && <span className="pa-error-msg">{errors.mobile}</span>}
//                   </div>

//                   <div className="pa-field">
//                     <label className="pa-label">Email Address <span>*</span></label>
//                     <input
//                       className={`pa-input ${errors.email ? "error" : ""}`}
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="you@email.com"
//                       required
//                     />
//                     {errors.email && <span className="pa-error-msg">{errors.email}</span>}
//                   </div>
//                 </div>
//               </div>

//               {/* ── PROPERTY DETAILS ── */}
//               <div className="pa-section">
//                 <div className="pa-section-label">Property Details</div>
//                 <div className="pa-grid-2">
//                   <div className="pa-field">
//                     <label className="pa-label">City <span>*</span></label>
//                     <input
//                       className="pa-input"
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       placeholder="e.g. Bangalore"
//                       required
//                     />
//                   </div>

//                   <div className="pa-field">
//                     <label className="pa-label">Property Type <span>*</span></label>
//                     <select
//                       className="pa-select"
//                       name="propertyType"
//                       value={formData.propertyType}
//                       onChange={handleChange}
//                       required
//                     >
//                       <option value="">Select type…</option>
//                       <option value="Apartment">Apartment</option>
//                       <option value="Independent House">Independent House</option>
//                       <option value="Independent Floor">Independent Floor</option>
//                     </select>
//                   </div>

//                   <div className="pa-field">
//                     <label className="pa-label">Building / Society Name <span>*</span></label>
//                     <input
//                       className="pa-input"
//                       type="text"
//                       name="buildingName"
//                       value={formData.buildingName}
//                       onChange={handleChange}
//                       placeholder="Building or society name"
//                       required
//                     />
//                   </div>

//                   <div className="pa-field">
//                     <label className="pa-label">Price (₹ / month) <span>*</span></label>
//                     <input
//                       className="pa-input"
//                       type="number"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleChange}
//                       placeholder="e.g. 8000"
//                       required
//                     />
//                   </div>

//                   <div className="pa-field pa-span-2">
//                     <label className="pa-label">Full Address <span>*</span></label>
//                     <textarea
//                       className="pa-textarea"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       placeholder="Street, locality, landmark…"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* ── ROOM & FURNISH ── */}
//               <div className="pa-section">
//                 <div className="pa-section-label">Room & Furnishing</div>

//                 <div className="pa-field" style={{ marginBottom: 18 }}>
//                   <label className="pa-label">Room Type <span>*</span></label>
//                   <div className="pa-options">
//                     {["Sharing", "1BHK", "2BHK", "3BHK"].map((t) => (
//                       <label className="pa-option-label" key={t}>
//                         <input
//                           type="checkbox"
//                           name="roomType"
//                           value={t}
//                           checked={formData.roomType.includes(t)}
//                           onChange={handleChange}
//                         />
//                         {t}
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="pa-field">
//                   <label className="pa-label">Furnish Type <span>*</span></label>
//                   <div className="pa-options">
//                     {["Furnished", "Semi-Furnished", "Unfurnished"].map((t) => (
//                       <label className="pa-option-label" key={t}>
//                         <input
//                           type="radio"
//                           name="furnishType"
//                           value={t}
//                           checked={formData.furnishType === t}
//                           onChange={handleChange}
//                           required
//                         />
//                         {t}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* ── NEARBY COLLEGES ── */}
//               <div className="pa-section">
//                 <div className="pa-section-label">Nearby Colleges</div>

//                 {formData.colleges.map((col, idx) => (
//                   <div className="pa-college-row" key={idx}>
//                     <input
//                       className="pa-input"
//                       type="text"
//                       name="name"
//                       placeholder="College / University"
//                       value={col.name}
//                       onChange={(e) => handleCollegeChange(idx, e)}
//                     />
//                     <input
//                       className="pa-input"
//                       type="text"
//                       name="distance"
//                       placeholder="Distance (km)"
//                       value={col.distance}
//                       onChange={(e) => handleCollegeChange(idx, e)}
//                     />
//                     {formData.colleges.length > 1 && (
//                       <button
//                         type="button"
//                         className="pa-remove-btn"
//                         onClick={() => removeCollege(idx)}
//                         title="Remove"
//                       >
//                         ✕
//                       </button>
//                     )}
//                   </div>
//                 ))}

//                 <button type="button" className="pa-add-btn" onClick={addCollege}>
//                   ＋ Add College
//                 </button>
//               </div>

//               {/* ── IMAGES ── */}
//               <div className="pa-section">
//                 <div className="pa-section-label">Property Photos</div>

//                 <div className="pa-upload-zone">
//                   <input
//                     type="file"
//                     name="images"
//                     accept="image/*"
//                     multiple
//                     onChange={handleChange}
//                   />
//                   <div className="pa-upload-icon">📷</div>
//                   <div className="pa-upload-text">
//                     Click or drag images here to upload
//                   </div>
//                 </div>

//                 {formData.images.length > 0 && (
//                   <div className="pa-image-previews">
//                     {formData.images.map((img, idx) => (
//                       <div className="pa-img-thumb" key={idx}>
//                         <img src={URL.createObjectURL(img)} alt="" />
//                         <button
//                           type="button"
//                           className="pa-img-remove"
//                           onClick={() => removeImage(idx)}
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* ── SUBMIT ── */}
//               <div className="pa-submit-section">
//                 <button
//                   type="submit"
//                   className="pa-submit-btn"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="pa-spinner" />
//                       Posting…
//                     </>
//                   ) : (
//                     "🚀 Post Accommodation"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }