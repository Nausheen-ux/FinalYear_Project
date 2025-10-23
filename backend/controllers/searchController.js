import Accommodation from "../models/Accommodation.js";
import User from "../models/userModel.js";

// ✅ Search accommodations based on preferences
export const searchAccommodations = async (req, res) => {
  try {
    const { rentRange, sharing, location, accommodationType, genderPreference } = req.query;

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

    // Note: genderPreference is not in the accommodation schema
    // You may need to add this field to your schema if it's important

    // Fetch accommodations with populated owner details
    const accommodations = await Accommodation.find(query)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Calculate match score for each accommodation (for better sorting)
    const results = accommodations.map((acc) => {
      let matchScore = 0;
      
      // Give higher score to exact location matches
      if (location && acc.city.toLowerCase().includes(location.toLowerCase())) {
        matchScore += 10;
      }
      
      // Give higher score if multiple room types match
      if (acc.roomType && acc.roomType.length > 0) {
        matchScore += acc.roomType.length;
      }
      
      return { ...acc, matchScore };
    });

    // Sort by match score and then by date
    results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
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
    
    const accommodation = await Accommodation.findById(id)
      .populate("ownerId", "name email")
      .lean();
    
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: accommodation,
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
