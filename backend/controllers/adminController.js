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

// GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected, totalUsers] = await Promise.all([
      Accommodation.countDocuments(),
      Accommodation.countDocuments({ status: "pending" }),
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
    const filter = req.query.status ? { status: req.query.status } : {};
    const properties = await Accommodation.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/properties/:id
export const getPropertyById = async (req, res) => {
  try {
    const property = await Accommodation.findById(req.params.id).populate("owner", "name email");
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