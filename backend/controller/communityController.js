const { CommunityPost } = require("../schema/communitySchema");

const listPosts = async (req, res) => {
  try {
    const { tag, q, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (tag) filter.tag = tag;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { body: { $regex: q, $options: "i" } },
        { tag: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CommunityPost.countDocuments(filter),
    ]);

    res.status(200).json({
      posts,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load community posts" });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, body, tag } = req.body;
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const post = await CommunityPost.create({
      authorId: req.user.id,
      authorName: req.user.fullName || req.user.email || "Student",
      title: title.trim(),
      body: body.trim(),
      tag: (tag || "General").trim(),
    });

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

const addReply = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.replies.push({
      authorId: req.user.id,
      authorName: req.user.fullName || req.user.email || "Student",
      body: body.trim(),
    });
    await post.save();

    res.status(201).json({ message: "Reply added", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add reply" });
  }
};

const toggleUpvote = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const idx = post.upvotes.findIndex((id) => id.toString() === userId);
    if (idx >= 0) post.upvotes.splice(idx, 1);
    else post.upvotes.push(userId);
    await post.save();

    res.status(200).json({
      message: "Updated",
      upvotes: post.upvotes.length,
      upvoted: idx < 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update vote" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.authorId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

module.exports = {
  listPosts,
  createPost,
  addReply,
  toggleUpvote,
  deletePost,
};
