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
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h3>Post not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/forum")}>
          Back to Forum
        </button>
      </div>
    );
  }

  const isAuthor = post.authorId === userId;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#5a2ca0", padding: "20px", color: "white" }}>
        <div className="container">
          <button
            className="btn btn-outline-light btn-sm mb-2"
            onClick={() => navigate("/forum")}
          >
            ← Back to Forum
          </button>
          <h2 className="mb-0">{isEditing ? "Edit Post" : post.title}</h2>
        </div>
      </div>

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                {isEditing ? (
                  /* EDIT MODE */
                  <div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Content</label>
                      <textarea
                        className="form-control"
                        rows="10"
                        value={editData.content}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-success" onClick={handleUpdate}>
                        Save Changes
                      </button>
                      <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VIEW MODE */
                  <div>
                    {/* Post Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-primary me-2">{post.category}</span>
                        <span className="badge bg-secondary">{post.city}</span>
                      </div>
                      {isAuthor && (
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setIsEditing(true)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleDelete}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="mb-4" style={{ whiteSpace: "pre-wrap" }}>
                      {post.content}
                    </div>

                    {/* Post Footer */}
                    <div className="border-top pt-3 text-muted">
                      <div className="d-flex justify-content-between">
                        <div>
                          <i className="bi bi-person-circle me-2"></i>
                          <strong>{post.authorName}</strong>
                        </div>
                        <div>
                          <i className="bi bi-clock me-1"></i>
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Person 3 will add Like Button here */}
                    <div className="border-top mt-3 pt-3">
                      <p className="text-muted mb-0">
                        <i className="bi bi-heart me-1"></i>
                        {post.likeCount || 0} likes
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Person 2 will add Comment Section here */}
            <div className="mt-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">
                    💬 Comments ({post.commentCount || 0})
                  </h5>
                  <p className="text-muted">Comment section coming soon...</p>
                  <p className="text-muted">
                    <small>Person 2 will implement the full comment system here</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}