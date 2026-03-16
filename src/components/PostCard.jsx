import React from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_COLORS = {
  "Part-Time Jobs": "primary",
  "City Services": "success",
  "Cafes & Restaurants": "warning",
  "Events & Meetups": "info",
  "Accommodation Tips": "danger",
  "Transportation": "secondary",
  "Study Groups": "dark",
  "General Discussion": "light"
};

export default function PostCard({ post, onRefresh }) {
  const navigate = useNavigate();

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

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const categoryColor = CATEGORY_COLORS[post.category] || "secondary";

  return (
    <div
      className="card h-100 shadow-sm"
      style={{ cursor: "pointer", transition: "transform 0.2s" }}
      onClick={() => navigate(`/forum/posts/${post._id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="card-body">
        {/* Category Badge */}
        <span className={`badge bg-${categoryColor} mb-2`}>
          {post.category}
        </span>

        {/* Title */}
        <h5 className="card-title mb-2">{post.title}</h5>

        {/* Content Preview */}
        <p className="card-text text-muted mb-3" style={{ fontSize: "0.9rem" }}>
          {truncateText(post.content, 120)}
        </p>

        {/* Footer Info */}
        <div className="d-flex justify-content-between align-items-center border-top pt-2">
          <div>
            <small className="text-muted">
              <i className="bi bi-person-circle me-1"></i>
              {post.authorName}
            </small>
            <br />
            <small className="text-muted">
              <i className="bi bi-geo-alt me-1"></i>
              {post.city}
            </small>
          </div>

          <div className="text-end">
            <small className="text-muted d-block">
              <i className="bi bi-clock me-1"></i>
              {formatDate(post.createdAt)}
            </small>
            
            {/* Person 3 will add like count here */}
            <small className="text-muted">
              <i className="bi bi-heart me-1"></i>
              {post.likeCount || 0}
              <span className="ms-2">
                <i className="bi bi-chat-dots me-1"></i>
                {post.commentCount || 0}
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}