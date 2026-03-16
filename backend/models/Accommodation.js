import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: { type: String },
  distance: { type: String },
});

const accommodationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["Apartment", "Independent House", "Independent Floor"],
    },
    buildingName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    roomType: {
      type: [String],
      required: true,
    },
    furnishType: {
      type: String,
      required: true,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
    },
    price: {
      type: Number,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    images: {
      type: [String], // store image URLs or base64 strings
    },
    colleges: [collegeSchema],

    // Optional: link with owner if you have authentication
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // auto-add createdAt and updatedAt
);

const Accommodation = mongoose.model("Accommodation", accommodationSchema);
export default Accommodation;
