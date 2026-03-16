import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/forum/posts/${id}`);
      
      if (response.data.success) {
        setPost(response.data.data);
        setEditData({
          title: response.data.data.title,
          content: response.data.data.content,
          category: response.data.data.category,
          city: response.data.data.city
        });
        
        // ✅ Set like status
        setLikeCount(response.data.data.likeCount || 0);
        setIsLiked(response.data.data.likes?.includes(userId) || false);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/forum/posts/${id}`,
        { data: { userId } }
      );

      if (response.data.success) {
        alert("Post deleted successfully");
        navigate("/forum");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/forum/posts/${id}`,
        { ...editData, userId }
      );

      if (response.data.success) {
        alert("Post updated successfully");
        setIsEditing(false);
        fetchPost();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error.response?.data?.message || "Failed to update post");
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  // ✅ Handle Like/Unlike
  const handleLike = async () => {
    if (!userId) {
      alert("Please log in to like posts");
      navigate("/login");
      return;
    }

    try {
      setLiking(true);
      const response = await axios.post(
        `http://localhost:5000/api/forum/posts/${id}/like`,
        { userId }
      );

      if (response.data.success) {
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to update like");
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div>
          <p className="mt-3" style={{ color: "#666" }}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <div className="text-center">
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📭</div>
          <h3>Post not found</h3>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate("/forum")}
            style={{ padding: "12px 30px", borderRadius: "10px" }}
          >
            Back to Forum
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = post.authorId === userId;

  const categoryColors = {
    "Part-Time Jobs": "#0d6efd",
    "City Services": "#198754",
    "Cafes & Restaurants": "#fd7e14",
    "Events & Meetups": "#0dcaf0",
    "Accommodation Tips": "#dc3545",
    "Transportation": "#6f42c1",
    "Study Groups": "#d63384",
    "General Discussion": "#20c997"
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", paddingTop: "20px", paddingBottom: "50px" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            {/* Back Button - Positioned above card */}
            <button
              onClick={() => navigate("/forum")}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                padding: "10px 24px",
                borderRadius: "25px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                marginBottom: "20px"
              }}
            >
              ← Back to Forum
            </button>

            {/* Main Post Card */}
            <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden", marginBottom: "20px" }}>
              
              {isEditing ? (
                /* ============ EDIT MODE ============ */
                <div style={{ padding: "40px 30px" }}>
                  <h4 style={{ marginBottom: "30px", color: "#2d3748" }}>Edit Post</h4>
                  
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4a5568" }}>Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      style={{ borderRadius: "10px", border: "2px solid #e2e8f0" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#4a5568" }}>Content</label>
                    <textarea
                      className="form-control"
                      rows="10"
                      value={editData.content}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      style={{ borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "15px" }}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success"
                      onClick={handleUpdate}
                      style={{ padding: "12px 30px", borderRadius: "10px", fontWeight: "600" }}
                    >
                      💾 Save Changes
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setIsEditing(false)}
                      style={{ padding: "12px 30px", borderRadius: "10px", fontWeight: "600" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ============ VIEW MODE ============ */
                <>
                  {/* Header */}
                  <div style={{ padding: "30px", borderBottom: "1px solid #e2e8f0" }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span 
                          style={{ 
                            display: "inline-block",
                            padding: "6px 16px", 
                            borderRadius: "20px", 
                            fontSize: "13px",
                            fontWeight: "600",
                            background: categoryColors[post.category] || "#6c757d",
                            color: "white",
                            marginRight: "10px"
                          }}
                        >
                          {post.category}
                        </span>
                        <span 
                          style={{ 
                            display: "inline-block",
                            padding: "6px 16px", 
                            borderRadius: "20px", 
                            fontSize: "13px",
                            fontWeight: "600",
                            background: "#e2e8f0",
                            color: "#4a5568"
                          }}
                        >
                          📍 {post.city}
                        </span>
                      </div>
                      {isAuthor && (
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setIsEditing(true)}
                            style={{ borderRadius: "8px 0 0 8px", padding: "8px 16px" }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleDelete}
                            style={{ borderRadius: "0 8px 8px 0", padding: "8px 16px" }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <h2 style={{ marginBottom: "20px", color: "#2d3748", fontWeight: "700" }}>
                      {post.title}
                    </h2>

                    <div className="d-flex align-items-center gap-3" style={{ color: "#718096", fontSize: "14px" }}>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ 
                          width: "40px", 
                          height: "40px", 
                          borderRadius: "50%", 
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "16px"
                        }}>
                          {post.authorName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", color: "#2d3748" }}>{post.authorName}</div>
                          <div style={{ fontSize: "12px" }}>{formatDate(post.createdAt)}</div>
                        </div>
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: "15px" }}>
                        <span>{isLiked ? "❤️" : "🤍"} {likeCount}</span>
                        <span>💬 {post.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "40px 30px" }}>
                    <div style={{ 
                      fontSize: "16px", 
                      lineHeight: "1.8", 
                      color: "#2d3748",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}>
                      {post.content}
                    </div>
                  </div>

                  {/* Like Section */}
                  <div style={{ padding: "20px 30px", borderTop: "1px solid #e2e8f0", background: "#f7fafc" }}>
                    <button
                      onClick={handleLike}
                      disabled={liking}
                      style={{
                        background: isLiked ? "linear-gradient(135deg, #ff6b6b, #ee5a6f)" : "transparent",
                        border: isLiked ? "none" : "2px solid #e2e8f0",
                        padding: "12px 24px",
                        borderRadius: "25px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: liking ? "not-allowed" : "pointer",
                        color: isLiked ? "white" : "#4a5568",
                        transition: "all 0.3s"
                      }}
                      onMouseOver={(e) => {
                        if (!isLiked && !liking) {
                          e.target.style.background = "#f7fafc";
                          e.target.style.borderColor = "#cbd5e0";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isLiked) {
                          e.target.style.background = "transparent";
                          e.target.style.borderColor = "#e2e8f0";
                        }
                      }}
                    >
                      {isLiked ? "❤️" : "🤍"} {isLiked ? "Liked" : "Like"} ({likeCount})
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Comments Section */}
            <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", padding: "30px" }}>
              <h5 style={{ marginBottom: "20px", color: "#2d3748", fontWeight: "700" }}>
                💬 Comments ({post.commentCount || 0})
              </h5>
              
              <div style={{ 
                padding: "40px", 
                textAlign: "center", 
                background: "#f7fafc", 
                borderRadius: "15px",
                border: "2px dashed #cbd5e0"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>💭</div>
                <p style={{ color: "#718096", marginBottom: "5px" }}>Comment section coming soon...</p>
                <small style={{ color: "#a0aec0" }}>Person 2 will implement the full comment system here</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}