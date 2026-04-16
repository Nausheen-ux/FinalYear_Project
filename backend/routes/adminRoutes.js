// const express = require("express");
// const router = express.Router();
// const {
//   getAllProperties,
//   getPropertyById,
//   approveProperty,
//   rejectProperty,
//   getDashboardStats,
//   getAllUsers,
// } = require("../controllers/adminController");
// const { protect } = require("../middleware/authMiddleware");
// const { isAdmin } = require("../middleware/adminMiddleware");

// // All routes protected + admin only
// router.use(protect, isAdmin);

// router.get("/stats", getDashboardStats);
// router.get("/properties", getAllProperties);
// router.get("/properties/:id", getPropertyById);
// router.patch("/properties/:id/approve", approveProperty);
// router.patch("/properties/:id/reject", rejectProperty);
// router.get("/users", getAllUsers);

// module.exports = router;


import express from "express";
import {
  getDashboardStats,
  getAllProperties,
  getPropertyById,
  approveProperty,
  rejectProperty,
  getAllUsers,
  getAllForumPosts,
  getForumPostWithComments,
  deleteAbusivePost,
  deleteAbusiveComment,
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes below require a valid JWT + admin role
router.use(protect, isAdmin);

router.get("/stats", getDashboardStats);
router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);
router.patch("/properties/:id/approve", approveProperty);
router.patch("/properties/:id/reject", rejectProperty);
router.get("/users", getAllUsers);

// ==================== FORUM MANAGEMENT ROUTES ====================
router.get("/forum/posts", getAllForumPosts);
router.get("/forum/posts/:id", getForumPostWithComments);
router.delete("/forum/posts/:id", deleteAbusivePost);
router.delete("/forum/comments/:id", deleteAbusiveComment);

export default router;