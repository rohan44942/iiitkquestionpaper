const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/userAuthenticate");
const optionalAuthenticate = require("../middleware/optionalAuthenticate");
const {
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
} = require("../controller/communityController");

router.get("/stats", getCommunityStats);
router.get("/", optionalAuthenticate, listPosts);
router.get("/:id", optionalAuthenticate, getPostById);
router.post("/", userAuthenticate, createPost);
router.patch("/:id", userAuthenticate, updatePost);
router.post("/:id/replies", userAuthenticate, addReply);
router.delete("/:id/replies/:replyId", userAuthenticate, deleteReply);
router.post("/:id/upvote", userAuthenticate, toggleUpvote);
router.post("/:id/replies/:replyId/upvote", userAuthenticate, toggleReplyUpvote);
router.post("/:id/bookmark", userAuthenticate, toggleBookmark);
router.post("/:id/replies/:replyId/accept", userAuthenticate, acceptReply);
router.post("/:id/pin", userAuthenticate, togglePin);
router.delete("/:id", userAuthenticate, deletePost);

module.exports = router;
