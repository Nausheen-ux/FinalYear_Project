import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = [
  "Part-Time Jobs",
  "City Services",
  "Cafes & Restaurants",
  "Events & Meetups",
  "Accommodation Tips",
  "Transportation",
  "Study Groups",
  "General Discussion"
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please login first");
      navigate("/login");
    }
  }, [navigate]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const userName =
      localStorage.getItem("ownerName") ||
      localStorage.getItem("userName") ||
      "Anonymous";

    if (!formData.title || !formData.content || !formData.category || !formData.city) {
      alert("Fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/forum/posts",
        {
          ...formData,
          authorId: userId,
          authorName: userName
        }
      );

      if (res.data.success) {

        alert("Post created successfully");

        navigate("/forum");

      }

    }
    catch (err) {

      alert("Error creating post");

    }
    finally {

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

                <label className="form-label fw-semibold">
                  Title
                </label>

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

                <small className="text-muted">
                  {formData.title.length}/200 characters
                </small>

              </div>


              {/* Category + City */}

              <div className="row">

                <div className="col-md-6 mb-4">

                  <label className="form-label fw-semibold">
                    Category
                  </label>

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

                  <label className="form-label fw-semibold">
                    City
                  </label>

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

                <label className="form-label fw-semibold">
                  Content
                </label>

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

                <small className="text-muted">
                  {formData.content.length}/5000 characters
                </small>

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