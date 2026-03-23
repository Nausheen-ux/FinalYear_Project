import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Part-Time Jobs",
        "City Services",
        "Cafes & Restaurants",
        "Events & Meetups",
        "Accommodation Tips",
        "Transportation",
        "Study Groups",
        "General Discussion"
      ]
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      default: []
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    likeCount: {
      type: Number,
      default: 0
    },
    // ✅ Added by Person 2 — tracks comment count directly on the post
    commentCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;