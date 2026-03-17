import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// ======================= GET COMMENTS FOR A POST =======================
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message
    });
  }
};

// ======================= ADD COMMENT =======================
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName, content } = req.body;

    if (!userId || !userName || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const newComment = new Comment({
      postId,
      userId,
      userName,
      content
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: newComment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message
    });
  }
};

// ======================= DELETE COMMENT =======================
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    // Check if user is the author
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments"
      });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message
    });
  }
};