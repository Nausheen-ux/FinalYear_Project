import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "../style/AdminLayout.css";
import "../style/AdminForum.css";

const AdminForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    city: "All",
    search: "",
    sortBy: "latest",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchForumPosts();
  }, [filters]);

  const fetchForumPosts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.category !== "All") queryParams.append("category", filters.category);
      if (filters.city !== "All") queryParams.append("city", filters.city);
      if (filters.search) queryParams.append("search", filters.search);
      queryParams.append("sortBy", filters.sortBy);

      const res = await fetch(`/api/admin/forum/posts?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        console.error("Error fetching posts:", data.message);
      }
    } catch (err) {
      console.error("Error fetching forum posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    try {
      const res = await fetch(`/api/admin/forum/posts/${selectedPost._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: deleteReason }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Post deleted successfully!");
        setPosts(posts.filter((p) => p._id !== selectedPost._id));
        setShowDeleteModal(false);
        setDeleteReason("");
        setSelectedPost(null);
      } else {
        alert("Failed to delete post: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error deleting post");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const reason = prompt("Enter reason for deleting this comment:");
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/forum/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Comment deleted successfully!");
        // Refresh the selected post
        if (selectedPost?._id === postId) {
          fetchPostDetails(postId);
        }
      } else {
        alert("Failed to delete comment: " + data.message);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment");
    }
  };

  const fetchPostDetails = async (postId) => {
    try {
      const res = await fetch(`/api/admin/forum/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setSelectedPost(data.data);
      }
    } catch (err) {
      console.error("Error fetching post details:", err);
    }
  };

  const categories = [
    "All",
    "Part-Time Jobs",
    "City Services",
    "Cafes & Restaurants",
    "Events & Meetups",
    "Accommodation Tips",
    "Transportation",
    "Study Groups",
    "General Discussion",
  ];

  const cities = [
    "All",
    "Dublin",
    "Cork",
    "Galway",
    "Limerick",
    "Waterford",
    "Belfast",
    "Derry",
    "Armagh",
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">Forum Management</h1>
          <p className="admin-subtitle">View and manage forum posts and comments</p>
        </div>

        {/* Filters */}
        <div className="forum-filters">
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="city">City:</label>
            <select
              id="city"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="mostLiked">Most Liked</option>
              <option value="mostCommented">Most Commented</option>
            </select>
          </div>

          <div className="filter-group">
            <input
              type="text"
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="forum-content">
          {loading ? (
            <div className="admin-loading">
              <div className="spinner" />
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="no-data-message">
              <p>No forum posts found.</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <div key={post._id} className="post-card">
                  <div className="post-header">
                    <div className="post-info">
                      <h3 className="post-title">{post.title}</h3>
                      <div className="post-meta">
                        <span className="post-author">👤 {post.authorName}</span>
                        <span className="post-category">
                          📌 {post.category}
                        </span>
                        <span className="post-city">📍 {post.city}</span>
                        <span className="post-date">
                          📅 {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="post-content">{post.content.substring(0, 200)}...</p>

                  <div className="post-stats">
                    <span>❤️ {post.likeCount} likes</span>
                    <span>💬 {post.commentCount} comments</span>
                  </div>

                  <div className="post-actions">
                    <button
                      className="btn-view"
                      onClick={() => fetchPostDetails(post._id)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        setSelectedPost(post);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Details Modal */}
        {selectedPost && !showDeleteModal && (
          <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close"
                onClick={() => setSelectedPost(null)}
              >
                ✕
              </button>

              <div className="post-details">
                <h2 className="modal-title">{selectedPost.title}</h2>

                <div className="post-details-meta">
                  <div>
                    <strong>Author:</strong> {selectedPost.authorName}
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedPost.category}
                  </div>
                  <div>
                    <strong>City:</strong> {selectedPost.city}
                  </div>
                  <div>
                    <strong>Posted:</strong>{" "}
                    {new Date(selectedPost.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="post-details-content">
                  <strong>Content:</strong>
                  <p>{selectedPost.content}</p>
                </div>

                {selectedPost.comments && selectedPost.comments.length > 0 ? (
                  <div className="comments-section">
                    <h3>Comments ({selectedPost.totalComments})</h3>
                    <div className="comments-list">
                      {selectedPost.comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                          <div className="comment-header">
                            <strong>{comment.userName}</strong>
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                          <button
                            className="btn-delete-comment"
                            onClick={() =>
                              handleDeleteComment(
                                selectedPost._id,
                                comment._id
                              )
                            }
                          >
                            Delete Comment
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="no-comments">No comments on this post.</p>
                )}

                <button
                  className="btn-delete-post"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete This Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Delete Post?</h2>
              <p className="warning-text">
                ⚠️ This will permanently delete the post and all its comments.
              </p>

              <div className="form-group">
                <label htmlFor="deleteReason">Reason for deletion:</label>
                <textarea
                  id="deleteReason"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="e.g., Abusive content, Spam, Inappropriate language"
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteReason("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-delete-confirm"
                  onClick={handleDeletePost}
                  disabled={!deleteReason.trim()}
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminForum;
