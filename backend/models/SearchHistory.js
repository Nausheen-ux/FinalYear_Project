import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: { type: String },
    locality: { type: String },
    accommodationType: { type: String },
    sharing: { type: String },
    rentRange: { type: String },
    college: { type: String },
    genderPreference: { type: String },
  },
  { timestamps: true }
);

// Keep only the last 20 searches per student — old ones auto-deleted
searchHistorySchema.index({ studentId: 1, createdAt: -1 });

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);
export default SearchHistory;