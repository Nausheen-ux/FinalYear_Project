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

  // Comment states
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // useState so React re-renders properly when auth changes (login/logout)
  const [userId, setUserId] = React.useState(localStorage.getItem("userId"));
  const [userName, setUserName] = React.useState(
    localStorage.getItem("ownerName") ||
    localStorage.getItem("userName") ||
    "Anonymous"
  );

  // Sync auth from localStorage on focus AND on logout event from any page
  React.useEffect(() => {
    const syncAuth = () => {
      setUserId(localStorage.getItem("userId"));
      setUserName(
        localStorage.getItem("ownerName") ||
        localStorage.getItem("userName") ||
        "Anonymous"
      );
    };
    syncAuth();
    window.addEventListener("focus", syncAuth);
    window.addEventListener("auth-logout", syncAuth);
    return () => {
      window.removeEventListener("focus", syncAuth);
      window.removeEventListener("auth-logout", syncAuth);
    };
  }, []);

  useEffect(() => {
    fetchPost();
    fetchComments();
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

  // ===================== FETCH COMMENTS =====================
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`http://localhost:5000/api/forum/posts/${id}/comments`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // ===================== ADD COMMENT =====================
  const handleAddComment = async () => {
    if (!userId) {
      navigate("/login", { state: { from: `/forum/${id}` } });
      return;
    }
    if (!commentText.trim()) return;

    try {
      setCommenting(true);
      const response = await axios.post(
        `http://localhost:5000/api/forum/posts/${id}/comments`,
        { content: commentText.trim() },
        authHeader()
      );

      if (response.data.success) {
        setComments((prev) => [response.data.data, ...prev]);
        setCommentText("");
        // Bump the visible comment count on the post header
        setPost((prev) => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: `/forum/${id}` } });
      } else {
        alert(error.response?.data?.message || "Failed to add comment");
      }
    } finally {
      setCommenting(false);
    }
  };

  // ===================== DELETE COMMENT =====================
  const handleDeleteComment = async (commentId) => {
    if (!userId) {
      navigate("/login", { state: { from: `/forum/${id}` } });
      return;
    }
    if (!window.confirm("Delete this comment?")) return;

    try {
      setDeletingCommentId(commentId);
      const response = await axios.delete(
        `http://localhost:5000/api/forum/comments/${commentId}`,
        authHeader()
      );

      if (response.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setPost((prev) => ({ ...prev, commentCount: Math.max((prev.commentCount || 1) - 1, 0) }));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: `/forum/${id}` } });
      } else {
        alert(error.response?.data?.message || "Failed to delete comment");
      }
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/forum/posts/${id}`,
        authHeader()
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
        editData,
        authHeader()
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

  const handleLike = async () => {
    if (!userId) {
      navigate("/login", { state: { from: `/forum/${id}` } });
      return;
    }

    try {
      setLiking(true);
      const response = await axios.post(
        `http://localhost:5000/api/forum/posts/${id}/like`,
        {},
        authHeader()
      );

      if (response.data.success) {
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: `/forum/${id}` } });
      } else {
        alert("Failed to update like");
      }
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
            {/* Back Button */}
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
                    >
                      {isLiked ? "❤️" : "🤍"} {isLiked ? "Liked" : "Like"} ({likeCount})
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ===================== COMMENTS SECTION ===================== */}
            <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", padding: "30px" }}>
              <h5 style={{ marginBottom: "24px", color: "#2d3748", fontWeight: "700" }}>
                💬 Comments ({comments.length})
              </h5>

              {/* Add Comment Box */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  {/* Avatar */}
                  <div style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "15px",
                    flexShrink: 0
                  }}>
                    {userName?.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <textarea
                      rows="3"
                      placeholder={userId ? "Write a comment..." : "Log in to comment"}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={!userId}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) handleAddComment();
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "14px",
                        resize: "none",
                        outline: "none",
                        color: "#2d3748",
                        transition: "border-color 0.2s",
                        background: userId ? "white" : "#f7fafc"
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <small style={{ color: "#a0aec0" }}>Ctrl + Enter to submit</small>
                      <button
                        onClick={handleAddComment}
                        disabled={commenting || !commentText.trim() || !userId}
                        style={{
                          background: commenting || !commentText.trim() || !userId
                            ? "#e2e8f0"
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                          color: commenting || !commentText.trim() || !userId ? "#a0aec0" : "white",
                          padding: "9px 22px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: commenting || !commentText.trim() || !userId ? "not-allowed" : "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {commenting ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", marginBottom: "24px" }} />

              {/* Comments List */}
              {loadingComments ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#718096" }}>
                  <div className="spinner-border spinner-border-sm text-primary" style={{ marginRight: "8px" }}></div>
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div style={{
                  padding: "40px",
                  textAlign: "center",
                  background: "#f7fafc",
                  borderRadius: "15px",
                  border: "2px dashed #cbd5e0"
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💭</div>
                  <p style={{ color: "#718096", marginBottom: "4px", fontWeight: "500" }}>No comments yet</p>
                  <small style={{ color: "#a0aec0" }}>Be the first to share your thoughts!</small>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {comments.map((comment) => (
                    <div
                      key={comment._id}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                        padding: "16px",
                        background: "#f7fafc",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0"
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                        flexShrink: 0
                      }}>
                        {comment.userName?.charAt(0).toUpperCase()}
                      </div>

                      {/* Comment Body */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: "600", fontSize: "14px", color: "#2d3748" }}>
                              {comment.userName}
                            </span>
                            {userId && comment.userId?.toString() === userId && (
                              <span style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                fontSize: "10px",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                fontWeight: "600"
                              }}>
                                You
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "12px", color: "#a0aec0" }}>
                              {formatDate(comment.createdAt)}
                            </span>
                            {userId && comment.userId?.toString() === userId && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                disabled={deletingCommentId === comment._id}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: deletingCommentId === comment._id ? "not-allowed" : "pointer",
                                  color: "#fc8181",
                                  fontSize: "13px",
                                  padding: "2px 4px",
                                  borderRadius: "4px",
                                  opacity: deletingCommentId === comment._id ? 0.5 : 1,
                                  transition: "color 0.2s"
                                }}
                                title="Delete comment"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#4a5568",
                          lineHeight: "1.6",
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap"
                        }}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}