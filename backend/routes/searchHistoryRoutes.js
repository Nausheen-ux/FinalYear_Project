import express from "express";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();

// POST /api/search-history — called by RentPage on every search submit
router.post("/", async (req, res) => {
  try {
    const { studentId, location, locality, accommodationType, sharing, rentRange, college, genderPreference } = req.body;

    if (!studentId) return res.status(400).json({ message: "studentId required" });

    await SearchHistory.create({
      studentId,
      location,
      locality,
      accommodationType,
      sharing,
      rentRange,
      college,
      genderPreference,
    });

    // Prune: keep only latest 20 per student
    const all = await SearchHistory.find({ studentId }).sort({ createdAt: -1 }).select("_id");
    if (all.length > 20) {
      const toDelete = all.slice(20).map(d => d._id);
      await SearchHistory.deleteMany({ _id: { $in: toDelete } });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving search history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;