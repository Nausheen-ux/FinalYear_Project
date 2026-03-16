import express from "express";
import {
  createAccommodation,
  getAllAccommodations,
  getOwnerAccommodations,
  deleteAccommodation,
  upload,
} from "../controllers/accommodationController.js";

const router = express.Router();

// ✅ POST accommodation with multiple images
router.post("/", upload.array("images", 5), createAccommodation);

// ✅ GET all accommodations
router.get("/", getAllAccommodations);

// ✅ GET accommodations by owner
router.get("/owner/:ownerId", getOwnerAccommodations);

// ✅ DELETE accommodation
router.delete("/:id", deleteAccommodation);

export default router;
