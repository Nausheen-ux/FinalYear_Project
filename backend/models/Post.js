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
    // Person 3 will add these later:
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    likeCount: {
      type: Number,
      default: 0
    },
    // ✅ REMOVED: commentCount virtual - Person 2 will add this later with Comment model
  },
  { 
    timestamps: true
    // ✅ REMOVED: toJSON and toObject virtuals until Comment model exists
  }
);

// ✅ COMMENTED OUT: Virtual for comment count - will be added by Person 2
// postSchema.virtual("commentCount", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "postId",
//   count: true
// });

const Post = mongoose.model("Post", postSchema);
export default Post;