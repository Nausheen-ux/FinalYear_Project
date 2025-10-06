import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function PostAccommodation() {
  const [formData, setFormData] = useState({
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

  // Handle form changes
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

  // College input change
  const handleCollegeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedColleges = [...formData.colleges];
    updatedColleges[index][name] = value;
    setFormData({ ...formData, colleges: updatedColleges });
  };

  // Add new college field
  const addCollege = () => {
    setFormData({
      ...formData,
      colleges: [...formData.colleges, { name: "", distance: "" }],
    });
  };

  // Remove a college entry
  const removeCollege = (index) => {
    const updatedColleges = formData.colleges.filter((_, i) => i !== index);
    setFormData({ ...formData, colleges: updatedColleges });
  };

  // Remove image
  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  // Validation
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log(formData);
    alert("Accommodation posted successfully!");
  };

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
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#5a2ca0" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/landing">
            Owner's Dashboard
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarContent"
          >
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
                <li>
                  <Link className="dropdown-item" to="/my-profile">
                    My Profile
                  </Link>
                </li>
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

      {/* Page content */}
      <div className="container flex-grow-1 d-flex justify-content-center align-items-start py-4">
        <div
          className="card shadow-lg p-4 w-100"
          style={{ maxWidth: "700px", backgroundColor: "white" }}
        >
          <h3 className="text-center mb-4">Post Your Accommodation</h3>
          <form onSubmit={handleSubmit}>
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

            {/* Building */}
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
                className={`form-control ${
                  errors.mobile ? "is-invalid" : ""
                }`}
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

            {/* Nearest Colleges */}
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
                {formData.images.length > 0 &&
                  formData.images.map((img, idx) => (
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

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100">
              Post Accommodation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
