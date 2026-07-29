const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, required: true },
    body: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    body: { type: String, required: true, trim: true, maxlength: 4000 },
    tag: { type: String, default: "General", trim: true, maxlength: 60 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: { type: [replySchema], default: [] },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ tag: 1 });

const CommunityPost = mongoose.model("CommunityPost", postSchema);
module.exports = { CommunityPost };
