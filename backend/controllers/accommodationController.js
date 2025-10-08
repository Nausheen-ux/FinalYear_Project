import Accommodation from "../models/Accommodation.js";
import multer from "multer";
import path from "path";

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ Multer upload instance
export const upload = multer({ storage: storage });

// ✅ Create a new accommodation post with images
export const createAccommodation = async (req, res) => {
  try {
    const {
      fullName,
      city,
      propertyType,
      buildingName,
      address,
      roomType,
      furnishType,
      price,
      mobile,
      email,
      colleges,
      ownerId,
    } = req.body;

    if (
      !fullName ||
      !city ||
      !propertyType ||
      !buildingName ||
      !address ||
      !roomType ||
      !furnishType ||
      !price ||
      !mobile ||
      !email
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // ✅ Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`); // Save relative path
    }

    const newAccommodation = new Accommodation({
      fullName,
      city,
      propertyType,
      buildingName,
      address,
      roomType: JSON.parse(roomType), // Because frontend sends as JSON string
      furnishType,
      price,
      mobile,
      email,
      colleges: JSON.parse(colleges), // Because frontend sends as JSON string
      images,
      ownerId,
    });

    const savedAccommodation = await newAccommodation.save();

    res.status(201).json({
      message: "Accommodation posted successfully",
      accommodation: savedAccommodation,
    });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all posted accommodations
export const getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().sort({ createdAt: -1 });
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching accommodations", error: error.message });
  }
};

// ✅ Get accommodations of a specific owner
export const getOwnerAccommodations = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const accommodations = await Accommodation.find({ ownerId }).sort({ createdAt: -1 });
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching owner accommodations", error: error.message });
  }
};

// ✅ Delete an accommodation
export const deleteAccommodation = async (req, res) => {
  try {
    const { id } = req.params;
    const accommodation = await Accommodation.findByIdAndDelete(id);

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    res.status(200).json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting accommodation", error: error.message });
  }
};
