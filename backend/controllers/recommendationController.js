import axios from "axios";
import SearchHistory from "../models/SearchHistory.js";
import Accommodation from "../models/Accommodation.js";

const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://localhost:5001";

export const getRecommendations = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch last 10 searches for this student
    const searches = await SearchHistory.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (!searches.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Fetch all properties
    const properties = await Accommodation.find({ status: "approved" }).lean();

    if (!properties.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Call Flask ML server
    const mlResponse = await axios.post(`${ML_SERVER_URL}/recommend`, {
      searches,
      properties,
      top_n: 6,
    });

    const { results } = mlResponse.data;

    if (!results || results.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Map scored IDs back to full property objects
    const propertyMap = {};
    properties.forEach((p) => {
      propertyMap[String(p._id)] = p;
    });

    const enriched = results
      .map((r) => propertyMap[r.id])
      .filter(Boolean);

    return res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    console.error("Recommendation error:", err.message);
    // Graceful fallback — never crash Node
    return res.status(200).json({ success: true, data: [] });
  }
};