// import mongoose from "mongoose";

// const collegeSchema = new mongoose.Schema({
//   name: { type: String },
//   distance: { type: String },
// });

// const accommodationSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     locality: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     accommodationType: {
//       type: String,
//       required: true,
//       enum: ["PG", "Flat", "Hostel"],
//     },
//     buildingName: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     sharing: {
//       type: String,
//       required: true,
//       enum: ["Single", "Double Sharing", "Triple Sharing"],
//     },
//     gender: {
//       type: String,
//       enum: ["Male", "Female"],
//       default: null,
//     },
//     roomType: {
//       type: [String],
//       required: true,
//     },
//     furnishType: {
//       type: String,
//       required: true,
//       enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     mobile: {
//       type: String,
//       required: true,
//       match: /^[0-9]{10}$/,
//     },
//     email: {
//       type: String,
//       required: true,
//       match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     },
//     images: {
//       type: [String], // store image URLs or base64 strings
//     },
//     colleges: [collegeSchema],

//     // Optional: link with owner if you have authentication
//     ownerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true } // auto-add createdAt and updatedAt
// );

// const Accommodation = mongoose.model("Accommodation", accommodationSchema);
// export default Accommodation;

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
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    accommodationType: {
      type: String,
      required: true,
      enum: ["PG", "Flat", "Hostel"],
    },
    buildingName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    sharing: {
      type: String,
      required: true,
      enum: ["Single", "Double Sharing", "Triple Sharing"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: null,
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
      type: [String],
    },
    colleges: [collegeSchema],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Accommodation", accommodationSchema);