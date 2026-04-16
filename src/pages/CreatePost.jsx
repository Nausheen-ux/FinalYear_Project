import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = [
  "Part-Time Jobs",
  "City Services",
  "Cafes & Restaurants",
  "Events & Meetups",
  "Accommodation Tips",
  "Study Groups",
  "General Discussion",
  "Roommate Finder"
];

const CITIES = [
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune"
];

export default function CreatePost() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    city: ""
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      alert("Please login first");
      navigate("/login", { state: { from: "/forum/create" } });
    }

    // Cleanup function to revoke object URLs
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [navigate, imagePreviews]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    if (selectedImages.length + files.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    // Check file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert("Please select only image files (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Check file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      alert("Each image must be less than 5MB");
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName =
      localStorage.getItem("ownerName") ||
      localStorage.getItem("userName") ||
      "Anonymous";

    if (!token || !userId) {
      alert("Please login first");
      navigate("/login", { state: { from: "/forum/create" } });
      return;
    }

    if (!formData.title || !formData.content || !formData.category || !formData.city) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("authorId", userId);
      formDataToSend.append("authorName", userName);

      // Add images to FormData
      selectedImages.forEach((image, index) => {
        formDataToSend.append("images", image);
      });

      const res = await axios.post(
        "http://localhost:5000/api/forum/posts",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        alert("Post created successfully");
        navigate("/forum");
      }

    } catch (err) {
      console.error("Error creating post:", err);
      if (err.response?.status === 401) {
        alert("Please login first");
        navigate("/login", { state: { from: "/forum/create" } });
      } else {
        alert(err.response?.data?.message || "Error creating post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Create Post</h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/forum")}
          >
            Back
          </button>
        </div>

        {/* Card */}
        <div className="card shadow-lg border-0">
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>

              {/* Title */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control form-control-lg"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={200}
                  required
                />
                <small className="text-muted">{formData.title.length}/200 characters</small>
              </div>

              {/* Category + City */}
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    name="category"
                    className="form-select form-select-lg"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">City</label>
                  <select
                    name="city"
                    className="form-select form-select-lg"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select city</option>
                    {CITIES.map(city => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Content</label>
                <textarea
                  name="content"
                  className="form-control"
                  rows="8"
                  placeholder="Write your post..."
                  value={formData.content}
                  onChange={handleChange}
                  maxLength={5000}
                  required
                />
                <small className="text-muted">{formData.content.length}/5000 characters</small>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Images (Optional)</label>
                <div className="border border-2 border-dashed border-primary rounded p-4 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="d-none"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="mb-3">
                      <i className="fas fa-cloud-upload-alt fa-3x text-primary"></i>
                    </div>
                    <p className="mb-2 fw-semibold">Click to upload images</p>
                    <p className="text-muted small">PNG, JPG, JPEG, GIF, WebP (Max 5 images, 5MB each)</p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-3">
                    <p className="fw-semibold mb-2">Selected Images ({imagePreviews.length}/5):</p>
                    <div className="d-flex flex-wrap gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="rounded"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                            style={{ width: '24px', height: '24px', padding: '0', fontSize: '12px' }}
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate("/forum")}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
