const mongoose = require("mongoose");
const { CommunityPost } = require("../schema/communitySchema");
const { ciExact, containsCi } = require("../utils/filterHelpers");

const authorNameFromReq = (req) =>
  req.user.fullName || req.user.email || "Student";

const enrichPost = (post, userId) => {
  if (!post) return post;
  const id = userId?.toString?.() || userId;
  return {
    ...post,
    upvoteCount: post.upvotes?.length || 0,
    replyCount: post.replies?.length || 0,
    bookmarkCount: post.bookmarkedBy?.length || 0,
    upvotedByMe: id
      ? (post.upvotes || []).some((u) => u.toString() === id)
      : false,
    bookmarkedByMe: id
      ? (post.bookmarkedBy || []).some((u) => u.toString() === id)
      : false,
    replies: (post.replies || []).map((r) => ({
      ...r,
      upvoteCount: r.upvotes?.length || 0,
      upvotedByMe: id
        ? (r.upvotes || []).some((u) => u.toString() === id)
        : false,
      isAccepted:
        post.acceptedReplyId &&
        r._id &&
        r._id.toString() === post.acceptedReplyId.toString(),
    })),
  };
};

const buildFilter = (query) => {
  const { tag, q, postType, status, unanswered, bookmarked, userId } = query;
  const filter = {};

  // Tags may be stored as CSE / cse / Cse
  if (tag) filter.tag = ciExact(tag);
  if (postType) filter.postType = postType;
  if (status === "resolved") filter.isResolved = true;
  if (status === "open") filter.isResolved = false;
  if (unanswered === "true") {
    filter.postType = "question";
    filter.$expr = { $eq: [{ $size: { $ifNull: ["$replies", []] } }, 0] };
  }
  if (bookmarked === "true" && userId) {
    filter.bookmarkedBy = new mongoose.Types.ObjectId(userId);
  }
  if (q?.trim()) {
    const term = containsCi(q);
    filter.$or = [
      { title: term },
      { body: term },
      { tag: term },
      { authorName: term },
    ];
  }
  return filter;
};

const sortSpec = (sort) => {
  switch (sort) {
    case "top":
      return { isPinned: -1, upvoteCount: -1, createdAt: -1 };
    case "active":
      return { isPinned: -1, replyCount: -1, updatedAt: -1 };
    case "views":
      return { isPinned: -1, views: -1, createdAt: -1 };
    case "oldest":
      return { isPinned: -1, createdAt: 1 };
    case "newest":
    default:
      return { isPinned: -1, createdAt: -1 };
  }
};

const listPosts = async (req, res) => {
  try {
    const {
      tag,
      q,
      page = 1,
      limit = 12,
      sort = "newest",
      postType,
      status,
      unanswered,
      bookmarked,
    } = req.query;

    const userId = req.user?.id;
    const filter = buildFilter({
      tag,
      q,
      postType,
      status,
      unanswered,
      bookmarked,
      userId,
    });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          upvoteCount: { $size: { $ifNull: ["$upvotes", []] } },
          replyCount: { $size: { $ifNull: ["$replies", []] } },
          bookmarkCount: { $size: { $ifNull: ["$bookmarkedBy", []] } },
        },
      },
      { $sort: sortSpec(sort) },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: parseInt(limit) }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await CommunityPost.aggregate(pipeline);
    const posts = (result.data || []).map((p) => enrichPost(p, userId));
    const total = result.total?.[0]?.count || 0;

    res.status(200).json({
      posts,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      hasMore: skip + posts.length < total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load community posts" });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ post: enrichPost(post, req.user?.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load post" });
  }
};

const getCommunityStats = async (req, res) => {
  try {
    const [totals, byTag, byType, recent] = await Promise.all([
      CommunityPost.aggregate([
        {
          $group: {
            _id: null,
            posts: { $sum: 1 },
            questions: {
              $sum: { $cond: [{ $eq: ["$postType", "question"] }, 1, 0] },
            },
            resolved: { $sum: { $cond: ["$isResolved", 1, 0] } },
            replies: { $sum: { $size: { $ifNull: ["$replies", []] } } },
          },
        },
      ]),
      CommunityPost.aggregate([
        { $group: { _id: "$tag", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      CommunityPost.aggregate([
        { $group: { _id: "$postType", count: { $sum: 1 } } },
      ]),
      CommunityPost.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title tag createdAt postType upvoteCount")
        .lean(),
    ]);

    res.status(200).json({
      stats: totals[0] || {
        posts: 0,
        questions: 0,
        resolved: 0,
        replies: 0,
      },
      tags: byTag.map((t) => ({ tag: t._id, count: t.count })),
      types: byType,
      recent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, body, tag, postType } = req.body;
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const allowedTypes = ["question", "discussion", "resource"];
    const type = allowedTypes.includes(postType) ? postType : "question";

    const post = await CommunityPost.create({
      authorId: req.user.id,
      authorName: authorNameFromReq(req),
      title: title.trim(),
      body: body.trim(),
      tag: (tag || "General").trim(),
      postType: type,
    });

    res.status(201).json({
      message: "Post created",
      post: enrichPost(post.toObject(), req.user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.authorId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { title, body, tag, postType, isResolved } = req.body;
    if (title !== undefined) post.title = title.trim().slice(0, 160);
    if (body !== undefined) post.body = body.trim().slice(0, 8000);
    if (tag !== undefined) post.tag = tag.trim().slice(0, 60);
    if (["question", "discussion", "resource"].includes(postType)) {
      post.postType = postType;
    }
    if (typeof isResolved === "boolean" && (isOwner || isAdmin)) {
      post.isResolved = isResolved;
    }

    await post.save();
    res.status(200).json({
      message: "Post updated",
      post: enrichPost(post.toObject(), req.user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post" });
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
      authorName: authorNameFromReq(req),
      body: body.trim(),
      upvotes: [],
    });
    post.updatedAt = new Date();
    await post.save();

    res.status(201).json({
      message: "Reply added",
      post: enrichPost(post.toObject(), req.user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add reply" });
  }
};

const deleteReply = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const isReplyOwner = reply.authorId?.toString() === req.user.id;
    const isPostOwner = post.authorId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isReplyOwner && !isPostOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (
      post.acceptedReplyId &&
      post.acceptedReplyId.toString() === reply._id.toString()
    ) {
      post.acceptedReplyId = null;
      post.isResolved = false;
    }

    reply.deleteOne();
    await post.save();

    res.status(200).json({
      message: "Reply deleted",
      post: enrichPost(post.toObject(), req.user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete reply" });
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
      post: enrichPost(post.toObject(), userId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update vote" });
  }
};

const toggleReplyUpvote = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const userId = req.user.id;
    const idx = (reply.upvotes || []).findIndex(
      (id) => id.toString() === userId
    );
    if (idx >= 0) reply.upvotes.splice(idx, 1);
    else reply.upvotes.push(userId);

    await post.save();
    res.status(200).json({
      message: "Updated",
      post: enrichPost(post.toObject(), userId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update reply vote" });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const idx = post.bookmarkedBy.findIndex((id) => id.toString() === userId);
    if (idx >= 0) post.bookmarkedBy.splice(idx, 1);
    else post.bookmarkedBy.push(userId);
    await post.save();

    res.status(200).json({
      message: idx < 0 ? "Bookmarked" : "Removed bookmark",
      bookmarked: idx < 0,
      post: enrichPost(post.toObject(), userId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update bookmark" });
  }
};

const acceptReply = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.authorId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Only the author can accept an answer" });
    }

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const already =
      post.acceptedReplyId &&
      post.acceptedReplyId.toString() === reply._id.toString();

    if (already) {
      post.acceptedReplyId = null;
      post.isResolved = false;
    } else {
      post.acceptedReplyId = reply._id;
      post.isResolved = true;
    }

    await post.save();
    res.status(200).json({
      message: already ? "Acceptance removed" : "Answer accepted",
      post: enrichPost(post.toObject(), req.user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to accept answer" });
  }
};

const togglePin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.isPinned = !post.isPinned;
    await post.save();

    res.status(200).json({
      message: post.isPinned ? "Pinned" : "Unpinned",
      post: enrichPost(post.toObject(), req.user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to pin post" });
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
  getPostById,
  getCommunityStats,
  createPost,
  updatePost,
  addReply,
  deleteReply,
  toggleUpvote,
  toggleReplyUpvote,
  toggleBookmark,
  acceptReply,
  togglePin,
  deletePost,
};
