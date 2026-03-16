import Accommodation from "../models/Accommodation.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import User from "../models/userModel.js";

// ✅ Search accommodations based on preferences
export const searchAccommodations = async (req, res) => {
  try {
    const { rentRange, sharing, location, accommodationType, genderPreference, studentId } = req.query;

    // Build query object
    let query = {};

    // 1. Filter by rent range
    if (rentRange) {
      switch (rentRange) {
        case "below5k":
          query.price = { $lt: 5000 };
          break;
        case "5k-10k":
          query.price = { $gte: 5000, $lte: 10000 };
          break;
        case "10k-20k":
          query.price = { $gte: 10000, $lte: 20000 };
          break;
        case "above20k":
          query.price = { $gt: 20000 };
          break;
      }
    }

    // 2. Filter by sharing/room type
    if (sharing) {
      switch (sharing) {
        case "single":
          query.roomType = { $in: ["1BHK", "2BHK", "3BHK"] };
          break;
        case "double":
        case "triple":
          query.roomType = { $in: ["Sharing"] };
          break;
      }
    }

    // 3. Filter by location (search in city and address)
    if (location) {
      query.$or = [
        { city: { $regex: location, $options: "i" } },
        { address: { $regex: location, $options: "i" } },
      ];
    }

    // 4. Filter by accommodation type (map to propertyType)
    if (accommodationType) {
      switch (accommodationType) {
        case "PG":
        case "Hostel":
          query.propertyType = { $in: ["Apartment", "Independent Floor"] };
          break;
        case "Flat":
          query.propertyType = { $in: ["Apartment", "Independent House", "Independent Floor"] };
          break;
      }
    }

    // Fetch accommodations with populated owner details
    const accommodations = await Accommodation.find(query)
      .populate("ownerId", "_id name email phone")
      .sort({ createdAt: -1 })
      .lean();

    // If student is logged in, fetch their connection requests
    let connectionMap = {};
    if (studentId) {
      const connections = await ConnectionRequest.find({ studentId });
      connections.forEach((c) => {
        connectionMap[c.propertyId.toString()] = c.status;
      });
    }

    // Attach connection info and owner visibility
    const enrichedResults = accommodations.map((acc) => {
      const connectionStatus = connectionMap[acc._id.toString()] || "none";

      // Hide owner contact info by default
      let ownerInfo = {
        name: acc.ownerId?.name || "N/A",
        email: null,
        phone: null,
        address: null,
      };

      // ✅ FIX: Reveal ONLY if approved (not when just "sent")
      if (connectionStatus === "approved") {
        ownerInfo.email = acc.email || acc.ownerId?.email || "Not Provided"; // Use accommodation email
        ownerInfo.phone = acc.mobile || "Not Provided"; // ✅ Use mobile from accommodation
        ownerInfo.address = acc.address || "Not Provided";
      }

      return {
        ...acc,
        connectionStatus,
        ownerInfo,
      };
    });

    // Sort by match score (optional, keep your original logic)
    const results = enrichedResults.map((acc) => {
      let matchScore = 0;
      if (location && acc.city.toLowerCase().includes(location.toLowerCase())) {
        matchScore += 10;
      }
      if (acc.roomType && acc.roomType.length > 0) {
        matchScore += acc.roomType.length;
      }
      return { ...acc, matchScore };
    });

    results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error searching accommodations:", error);
    res.status(500).json({
      success: false,
      message: "Error searching accommodations",
      error: error.message,
    });
  }
};

// ✅ Get single accommodation details
export const getAccommodationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.query;

    const accommodation = await Accommodation.findById(id)
      .populate("ownerId", "_id name email phone")
      .lean();

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      });
    }

    let connectionStatus = "none";
    if (studentId) {
      const connection = await ConnectionRequest.findOne({
        propertyId: id,
        studentId,
      });
      if (connection) connectionStatus = connection.status;
    }

    let ownerInfo = {
      name: accommodation.ownerId?.name || "N/A",
      email: null,
      phone: null,
      address: null,
    };

    // ✅ FIX: Only reveal if approved
    if (connectionStatus === "approved") {
      ownerInfo.email = accommodation.ownerId?.email || "Not Provided";
      ownerInfo.phone = accommodation.ownerId?.phone || "Not Provided";
      ownerInfo.address = accommodation.address || "Not Provided";
    }

    res.status(200).json({
      success: true,
      data: { ...accommodation, connectionStatus, ownerInfo },
    });
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching accommodation details",
      error: error.message,
    });
  }
};