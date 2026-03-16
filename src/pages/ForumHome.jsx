import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";
import "../style/ForumHome.css";

const CATEGORIES = [
  { name: "All", icon: "📋", color: "#6c757d" },
  { name: "Part-Time Jobs", icon: "💼", color: "#0d6efd" },
  { name: "City Services", icon: "🔧", color: "#198754" },
  { name: "Cafes & Restaurants", icon: "☕", color: "#fd7e14" },
  { name: "Events & Meetups", icon: "🎉", color: "#0dcaf0" },
  { name: "Accommodation Tips", icon: "🏠", color: "#dc3545" },
  { name: "Transportation", icon: "🚌", color: "#6f42c1" },
  { name: "Study Groups", icon: "📚", color: "#d63384" },
  { name: "General Discussion", icon: "💬", color: "#20c997" }
];

const CITIES = [
  "All", "Kolkata", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostLiked", label: "Most Liked" }
];

export default function ForumHome() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Get category from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get("category");
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedCity, searchQuery, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedCity !== "All") params.append("city", selectedCity);
      if (searchQuery) params.append("search", searchQuery);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await axios.get(
        `http://localhost:5000/api/forum/posts?${params.toString()}`
      );

      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryStyle = (categoryName) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category ? category.color : "#6c757d";
  };

  return (
    <div className="forum-page">
      {/* Header */}
      <div className="forum-header">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button
                className="btn btn-outline-light btn-sm me-3"
                onClick={() => navigate("/landing")}
              >
                ← Back to Home
              </button>
              <span className="forum-header-title">💬 Discussion Forum</span>
            </div>
            <button
              className="btn btn-light"
              onClick={() => navigate("/forum/create")}
            >
              ➕ Create Post
            </button>
          </div>
        </div>
      </div>

      <div className="forum-container-main">
        {/* LEFT SIDEBAR - Reddit Style Categories */}
        <aside className="forum-sidebar">
          <div className="sidebar-section">
            <h6 className="sidebar-title">Categories</h6>
            <div className="category-list">
              {CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category.name)}
                  style={{
                    borderLeft: selectedCategory === category.name 
                      ? `4px solid ${category.color}` 
                      : '4px solid transparent'
                  }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  {selectedCategory === category.name && (
                    <span className="category-badge">
                      {posts.length}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="sidebar-section mt-4">
            <h6 className="sidebar-title">Community Stats</h6>
            <div className="stats-box">
              <div className="stat-item">
                <div className="stat-number">{posts.length}</div>
                <div className="stat-label">Posts</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {posts.reduce((sum, post) => sum + (post.commentCount || 0), 0)}
                </div>
                <div className="stat-label">Comments</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="forum-main-content">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="row g-3 align-items-center">
              {/* Search */}
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* City Filter */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      📍 {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Current Category Badge */}
          {selectedCategory !== "All" && (
            <div className="current-category-banner">
              <span style={{ color: getCategoryStyle(selectedCategory) }}>
                {CATEGORIES.find(c => c.name === selectedCategory)?.icon}
              </span>
              <span className="ms-2">{selectedCategory}</span>
              <button 
                className="btn btn-sm btn-link"
                onClick={() => setSelectedCategory("All")}
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Posts Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>No posts found</h4>
              <p className="text-muted">Be the first to create a post in this category!</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/forum/create")}
              >
                Create Post
              </button>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onRefresh={fetchPosts}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}