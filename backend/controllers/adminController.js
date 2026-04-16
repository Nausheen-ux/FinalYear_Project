// const Accommodation = require("../models/Accommodation");
// const User = require("../models/userModel");

// // GET /api/admin/properties?status=pending|approved|rejected
// const getAllProperties = async (req, res) => {
//   try {
//     const { status } = req.query;
//     const filter = status ? { status } : {};
//     const properties = await Accommodation.find(filter)
//       .populate("owner", "name email phone")
//       .sort({ createdAt: -1 });
//     res.json({ success: true, count: properties.length, properties });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET /api/admin/properties/:id
// const getPropertyById = async (req, res) => {
//   try {
//     const property = await Accommodation.findById(req.params.id).populate(
//       "owner",
//       "name email phone"
//     );
//     if (!property)
//       return res
//         .status(404)
//         .json({ success: false, message: "Property not found" });
//     res.json({ success: true, property });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // PATCH /api/admin/properties/:id/approve
// const approveProperty = async (req, res) => {
//   try {
//     const property = await Accommodation.findByIdAndUpdate(
//       req.params.id,
//       { status: "approved", reviewedAt: new Date(), reviewedBy: req.user._id },
//       { new: true }
//     );
//     if (!property)
//       return res
//         .status(404)
//         .json({ success: false, message: "Property not found" });
//     res.json({ success: true, message: "Property approved", property });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // PATCH /api/admin/properties/:id/reject
// const rejectProperty = async (req, res) => {
//   try {
//     const { reason } = req.body;
//     const property = await Accommodation.findByIdAndUpdate(
//       req.params.id,
//       {
//         status: "rejected",
//         rejectionReason: reason || "Does not meet our standards",
//         reviewedAt: new Date(),
//         reviewedBy: req.user._id,
//       },
//       { new: true }
//     );
//     if (!property)
//       return res
//         .status(404)
//         .json({ success: false, message: "Property not found" });
//     res.json({ success: true, message: "Property rejected", property });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET /api/admin/stats
// const getDashboardStats = async (req, res) => {
//   try {
//     const [total, pending, approved, rejected, totalUsers] = await Promise.all([
//       Accommodation.countDocuments(),
//       Accommodation.countDocuments({ status: "pending" }),
//       Accommodation.countDocuments({ status: "approved" }),
//       Accommodation.countDocuments({ status: "rejected" }),
//       User.countDocuments({ role: "user" }),
//     ]);
//     res.json({
//       success: true,
//       stats: { total, pending, approved, rejected, totalUsers },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET /api/admin/users
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({ role: { $ne: "admin" } })
//       .select("-password")
//       .sort({ createdAt: -1 });
//     res.json({ success: true, count: users.length, users });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// module.exports = {
//   getAllProperties,
//   getPropertyById,
//   approveProperty,
//   rejectProperty,
//   getDashboardStats,
//   getAllUsers,
// };

import Accommodation from "../models/Accommodation.js";
import User from "../models/userModel.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected, totalUsers] = await Promise.all([
      Accommodation.countDocuments(),
      Accommodation.countDocuments({
        $or: [
          { status: "pending" },
          { status: { $exists: false } },
        ],
      }),
      Accommodation.countDocuments({ status: "approved" }),
      Accommodation.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: { $ne: "admin" } }),
    ]);

    res.json({ success: true, stats: { total, pending, approved, rejected, totalUsers } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/properties?status=pending|approved|rejected
export const getAllProperties = async (req, res) => {
  try {
    let filter = {};
    if (req.query.status === "pending") {
      filter = {
        $or: [
          { status: "pending" },
          { status: { $exists: false } },
        ],
      };
    } else if (req.query.status) {
      filter = { status: req.query.status };
    }

    const properties = await Accommodation.find(filter)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/properties/:id
export const getPropertyById = async (req, res) => {
  try {
    const property = await Accommodation.findById(req.params.id).populate("ownerId", "name email");
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/properties/:id/approve
export const approveProperty = async (req, res) => {
  try {
    const property = await Accommodation.findByIdAndUpdate(
      req.params.id,
      { status: "approved", reviewedAt: new Date(), reviewedBy: req.user._id },
      { new: true }
    );
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, message: "Property approved", property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/properties/:id/reject
export const rejectProperty = async (req, res) => {
  try {
    const { reason } = req.body;
    const property = await Accommodation.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: reason || "Does not meet our standards",
        reviewedAt: new Date(),
        reviewedBy: req.user._id,
      },
      { new: true }
    );
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, message: "Property rejected", property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==================== FORUM MANAGEMENT ====================

// GET /api/admin/forum/posts - View all forum posts with comments
export const getAllForumPosts = async (req, res) => {
  try {
    const { category, city, search, sortBy } = req.query;

    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (city && city !== "All") {
      query.city = city;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    let sort = {};
    switch (sortBy) {
      case "latest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "mostLiked":
        sort = { likeCount: -1 };
        break;
      case "mostCommented":
        sort = { commentCount: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const posts = await Post.find(query)
      .sort(sort)
      .populate("authorId", "name email")
      .lean();

    // Fetch comments for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ postId: post._id })
          .populate("userId", "name email")
          .lean();
        return {
          ...post,
          comments,
          totalComments: comments.length
        };
      })
    );

    res.status(200).json({
      success: true,
      count: postsWithComments.length,
      data: postsWithComments
    });
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch forum posts",
      error: error.message
    });
  }
};

// GET /api/admin/forum/posts/:id - Get single post with all comments
export const getForumPostWithComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("authorId", "name email")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const comments = await Comment.find({ postId: id })
      .populate("userId", "name email")
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...post,
        comments,
        totalComments: comments.length
      }
    });
  } catch (error) {
    console.error("Error fetching post with comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message
    });
  }
};

// DELETE /api/admin/forum/posts/:id - Delete abusive post and its comments
export const deleteAbusivePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ postId: id });

    // Delete the post
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Post deleted successfully by admin. Reason: ${reason || "No reason provided"}`
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message
    });
  }
};

// DELETE /api/admin/forum/comments/:id - Delete abusive comment
export const deleteAbusiveComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    const postId = comment.postId;

    // Delete the comment
    await Comment.findByIdAndDelete(id);

    // Update comment count on the post
    await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentCount: -1 } }
    );

    res.status(200).json({
      success: true,
      message: `Comment deleted successfully by admin. Reason: ${reason || "No reason provided"}`
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message
    });
  }
};