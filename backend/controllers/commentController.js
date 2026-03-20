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
// Protected route — req.user is set by the protect middleware
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Use verified user from token — never trust userId from body
    const userId = req.user._id;
    const userName = req.user.name;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required"
      });
    }

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

    // ✅ Increment commentCount on the Post in the DB
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

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
// Protected route — req.user is set by the protect middleware
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Use verified user from token
    const userId = req.user._id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments"
      });
    }

    await Comment.findByIdAndDelete(id);

    // ✅ Decrement commentCount on the Post in the DB
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -1 }
    });

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