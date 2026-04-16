import mongoose from "mongoose";
import dotenv from "dotenv";
import Accommodation from "./models/Accommodation.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const approveAllProperties = async () => {
  try {
    console.log("🔄 Starting bulk approval of all properties...");

    // Update all properties that are pending or don't have status to approved
    const result = await Accommodation.updateMany(
      {
        $or: [
          { status: "pending" },
          { status: { $exists: false } },
          { status: null }
        ]
      },
      {
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy: null // Since this is a bulk operation
      }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} properties to approved status`);
    console.log(`📊 Matched ${result.matchedCount} documents`);

    // Get updated stats
    const stats = await Accommodation.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    console.log("📈 Current property status breakdown:");
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating properties:", error);
    process.exit(1);
  }
};

approveAllProperties();