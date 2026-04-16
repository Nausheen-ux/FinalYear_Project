import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
  toggleLike,
  upload
} from "../controllers/postController.js";

import {
  getComments,
  addComment,
  deleteComment
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================== POST ROUTES ====================
router.post("/posts", protect, upload.array("images", 5), createPost);
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/:id", protect, updatePost);
router.delete("/posts/:id", protect, deletePost);
router.get("/users/:userId/posts", getUserPosts);

// ==================== LIKE ROUTES ====================
router.post("/posts/:id/like", protect, toggleLike);

// ==================== COMMENT ROUTES ====================
router.get("/posts/:postId/comments", getComments);
router.post("/posts/:postId/comments", protect, addComment);
router.delete("/comments/:id", protect, deleteComment);

export default router;