import Post from "../models/Post.js";

// ======================= CREATE POST =======================
export const createPost = async (req, res) => {
  try {
    const { title, content, category, city } = req.body;

    // Get user info from localStorage (frontend sends this)
    const { authorId, authorName } = req.body;

    if (!title || !content || !category || !city || !authorId || !authorName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newPost = new Post({
      title,
      content,
      category,
      city,
      authorId,
      authorName,
      images: req.body.images || []
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully!",
      data: newPost
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message
    });
  }
};

// ======================= GET ALL POSTS (with filters) =======================
export const getAllPosts = async (req, res) => {
  try {
    const { category, city, search, sortBy } = req.query;

    // Build query
    let query = {};
    
    if (category && category !== "All") {
      query.category = category;
    }
    
    if (city && city !== "All") {
      query.city = city;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case "latest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "mostLiked":
        sort = { likeCount: -1 };
        break;
      default:
        sort = { createdAt: -1 }; // default to latest
    }

    const posts = await Post.find(query)
      .sort(sort)
      // ✅ REMOVED: .populate("commentCount") - will be added by Person 2
      .lean();

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message
    });
  }
};

// ======================= GET SINGLE POST =======================
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      // ✅ REMOVED: .populate("commentCount") - will be added by Person 2
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message
    });
  }
};

// ======================= UPDATE POST =======================
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, city, userId } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user is the author
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts"
      });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (city) post.city = city;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message
    });
  }
};

// ======================= DELETE POST =======================
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user is the author
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts"
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message
    });
  }
};

// ======================= GET POSTS BY USER =======================
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 })
      // ✅ REMOVED: .populate("commentCount") - will be added by Person 2
      .lean();

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user posts",
      error: error.message
    });
  }
};