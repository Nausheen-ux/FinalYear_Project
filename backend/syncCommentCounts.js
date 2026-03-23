// syncCommentCounts.js
// Run this ONCE to fix commentCount for all existing posts
// Usage: node syncCommentCounts.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";

dotenv.config();

const syncCommentCounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts to sync...`);

    let updated = 0;
    for (const post of posts) {
      const count = await Comment.countDocuments({ postId: post._id });
      await Post.findByIdAndUpdate(post._id, { commentCount: count });
      updated++;
      console.log(`Updated post "${post.title}" → commentCount: ${count}`);
    }

    console.log(`\n✅ Done! Synced ${updated} posts.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

syncCommentCounts();