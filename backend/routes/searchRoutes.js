import express from "express";
import {
  searchAccommodations,
  getAccommodationById,
} from "../controllers/searchController.js";

const router = express.Router();

// ✅ Search accommodations with filters
// GET /api/search?rentRange=5k-10k&sharing=single&location=Kolkata
router.get("/", searchAccommodations);

// ✅ Get single accommodation by ID
// GET /api/search/:id
router.get("/:id", getAccommodationById);

export default router;
