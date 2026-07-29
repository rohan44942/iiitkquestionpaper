const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/userAuthenticate");
const {
  listPosts,
  createPost,
  addReply,
  toggleUpvote,
  deletePost,
} = require("../controller/communityController");

router.get("/", listPosts);
router.post("/", userAuthenticate, createPost);
router.post("/:id/replies", userAuthenticate, addReply);
router.post("/:id/upvote", userAuthenticate, toggleUpvote);
router.delete("/:id", userAuthenticate, deletePost);

module.exports = router;
