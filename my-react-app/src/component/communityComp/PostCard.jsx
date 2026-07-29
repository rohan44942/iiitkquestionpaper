import { Link } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PushPinIcon from "@mui/icons-material/PushPin";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { timeAgo } from "./communityUtils";

const typeStyles = {
  question: "bg-sky-100 text-sky-800",
  discussion: "bg-violet-100 text-violet-800",
  resource: "bg-amber-100 text-amber-900",
};

export default function PostCard({
  post,
  onUpvote,
  onBookmark,
  highlight = false,
}) {
  return (
    <article
      className={`surface-card p-5 animate-fadeUp transition ${
        highlight ? "ring-2 ring-accent/30" : ""
      } ${post.isPinned ? "border-accent/40" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {post.isPinned && (
          <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
            <PushPinIcon sx={{ fontSize: 14 }} /> Pinned
          </span>
        )}
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
            typeStyles[post.postType] || typeStyles.question
          }`}
        >
          {post.postType || "question"}
        </span>
        <span className="chip">{post.tag || "General"}</span>
        {post.isResolved && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
            <CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> Resolved
          </span>
        )}
        <span className="text-xs text-ink-muted ml-auto">
          {post.authorName} · {timeAgo(post.createdAt)}
        </span>
      </div>

      <Link to={`/community/${post._id}`} className="block group">
        <h2 className="font-display text-xl text-ink group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-ink-muted mt-2 line-clamp-2 whitespace-pre-wrap">
          {post.body}
        </p>
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => onUpvote(post._id)}
          className={`btn-ghost !py-1.5 !px-3 ${
            post.upvotedByMe ? "!bg-accent-soft !text-accent !border-accent/30" : ""
          }`}
        >
          {post.upvotedByMe ? (
            <ThumbUpAltIcon fontSize="inherit" />
          ) : (
            <ThumbUpOutlinedIcon fontSize="inherit" />
          )}
          {post.upvoteCount ?? post.upvotes?.length ?? 0}
        </button>

        <Link
          to={`/community/${post._id}`}
          className="btn-ghost !py-1.5 !px-3 text-ink-muted"
        >
          <ChatBubbleOutlineOutlinedIcon fontSize="inherit" />
          {post.replyCount ?? post.replies?.length ?? 0}
        </Link>

        <button
          type="button"
          onClick={() => onBookmark(post._id)}
          className={`btn-ghost !py-1.5 !px-3 ${
            post.bookmarkedByMe ? "!text-accent" : ""
          }`}
          title="Bookmark"
        >
          {post.bookmarkedByMe ? (
            <BookmarkIcon fontSize="inherit" />
          ) : (
            <BookmarkBorderOutlinedIcon fontSize="inherit" />
          )}
          {post.bookmarkCount || ""}
        </button>

        <span className="inline-flex items-center gap-1 text-ink-muted ml-auto">
          <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
          {post.views || 0} views
        </span>
      </div>
    </article>
  );
}
