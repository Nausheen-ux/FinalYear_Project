import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts
} from "../controllers/postController.js";

const router = express.Router();

// ==================== POST ROUTES ====================
// Create a new post
router.post("/posts", createPost);

// Get all posts (with filters)
router.get("/posts", getAllPosts);

// Get single post by ID
router.get("/posts/:id", getPostById);

// Update post
router.put("/posts/:id", updatePost);

// Delete post
router.delete("/posts/:id", deletePost);

// Get posts by specific user
router.get("/users/:userId/posts", getUserPosts);

// ==================== PLACEHOLDER FOR PERSON 2 & 3 ====================
// Person 2 will add comment routes here
// Person 3 will add like routes here

export default router;