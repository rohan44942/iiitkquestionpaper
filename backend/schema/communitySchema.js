const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, required: true },
    body: { type: String, required: true, maxlength: 3000 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    body: { type: String, required: true, trim: true, maxlength: 8000 },
    tag: { type: String, default: "General", trim: true, maxlength: 60 },
    postType: {
      type: String,
      enum: ["question", "discussion", "resource"],
      default: "question",
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: { type: [replySchema], default: [] },
    acceptedReplyId: { type: mongoose.Schema.Types.ObjectId, default: null },
    isPinned: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ tag: 1, createdAt: -1 });
postSchema.index({ postType: 1 });
postSchema.index({ isPinned: -1, createdAt: -1 });
postSchema.index({ title: "text", body: "text", tag: "text" });

const CommunityPost = mongoose.model("CommunityPost", postSchema);
module.exports = { CommunityPost };
