import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contextapi/userContext";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PushPinIcon from "@mui/icons-material/PushPin";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  COMMUNITY_TAGS,
  POST_TYPES,
  requireAuth,
  timeAgo,
} from "./communityUtils";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(UserContext);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", body: "", tag: "", postType: "" });
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/api/community/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Post not found");
      const data = await res.json();
      setPost(data.post);
      setEditForm({
        title: data.post.title,
        body: data.post.body,
        tag: data.post.tag,
        postType: data.post.postType || "question",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, id]);

  useEffect(() => {
    load();
  }, [load]);

  const isOwner =
    user &&
    post &&
    String(user._id || user.id) === String(post.authorId);
  const isAdmin = user?.role === "admin";

  const api = async (path, options = {}) => {
    const res = await fetch(`${apiUrl}/api/community${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  };

  const patchPost = (next) => setPost(next);

  const upvote = async () => {
    if (!requireAuth(isAuthenticated)) return;
    try {
      const data = await api(`/${id}/upvote`, { method: "POST" });
      patchPost(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const bookmark = async () => {
    if (!requireAuth(isAuthenticated)) return;
    try {
      const data = await api(`/${id}/bookmark`, { method: "POST" });
      patchPost(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const pin = async () => {
    if (!requireAuth(isAuthenticated)) return;
    try {
      const data = await api(`/${id}/pin`, { method: "POST" });
      patchPost(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    setBusy(true);
    try {
      await api(`/${id}`, { method: "DELETE" });
      navigate("/community");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editForm),
      });
      patchPost(data.post);
      setEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggleResolved = async () => {
    try {
      const data = await api(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isResolved: !post.isResolved }),
      });
      patchPost(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!requireAuth(isAuthenticated)) return;
    if (!replyBody.trim()) return;
    setBusy(true);
    try {
      const data = await api(`/${id}/replies`, {
        method: "POST",
        body: JSON.stringify({ body: replyBody }),
      });
      patchPost(data.post);
      setReplyBody("");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const upvoteReply = async (replyId) => {
    if (!requireAuth(isAuthenticated)) return;
    try {
      const data = await api(`/${id}/replies/${replyId}/upvote`, {
        method: "POST",
      });
      patchPost(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const acceptReply = async (replyId) => {
    if (!requireAuth(isAuthenticated)) return;
    try {
      const data = await api(`/${id}/replies/${replyId}/accept`, {
        method: "POST",
      });
      patchPost(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteReply = async (replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      const data = await api(`/${id}/replies/${replyId}`, { method: "DELETE" });
      patchPost(data.post);
    } catch (err) {
      alert(err.message);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Could not copy link");
    }
  };

  if (loading) {
    return (
      <div className="page-shell max-w-3xl space-y-3">
        <div className="skeleton h-10 w-40" />
        <div className="skeleton h-64" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-shell max-w-3xl">
        <div className="surface-card p-10 text-center">
          <p className="font-display text-xl">{error || "Post not found"}</p>
          <Link to="/community" className="btn-primary mt-4 inline-flex">
            Back to community
          </Link>
        </div>
      </div>
    );
  }

  const sortedReplies = [...(post.replies || [])].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return (b.upvoteCount || 0) - (a.upvoteCount || 0);
  });

  return (
    <div className="page-shell max-w-3xl">
      <button
        type="button"
        onClick={() => navigate("/community")}
        className="btn-ghost !py-1.5 mb-4"
      >
        <ArrowBackIcon fontSize="small" /> Back
      </button>

      <article className="surface-card p-6 sm:p-8 animate-fadeUp">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.isPinned && (
            <span className="chip inline-flex items-center gap-1">
              <PushPinIcon sx={{ fontSize: 14 }} /> Pinned
            </span>
          )}
          <span className="chip capitalize">{post.postType}</span>
          <span className="chip !bg-paper !text-ink-muted">{post.tag}</span>
          {post.isResolved && (
            <span className="chip !bg-emerald-50 !text-emerald-700">Resolved</span>
          )}
        </div>

        {!editing ? (
          <>
            <h1 className="font-display text-3xl text-ink">{post.title}</h1>
            <p className="text-xs text-ink-muted mt-2">
              {post.authorName} · {timeAgo(post.createdAt)} · {post.views || 0}{" "}
              views
            </p>
            <p className="text-ink-soft mt-5 whitespace-pre-wrap leading-relaxed">
              {post.body}
            </p>
          </>
        ) : (
          <form onSubmit={saveEdit} className="space-y-3">
            <input
              className="field"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
            <textarea
              className="field min-h-[160px]"
              value={editForm.body}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, body: e.target.value }))
              }
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="field"
                value={editForm.tag}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, tag: e.target.value }))
                }
              >
                {COMMUNITY_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                className="field"
                value={editForm.postType}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, postType: e.target.value }))
                }
              >
                {POST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={busy}>
                Save
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={upvote}
            className={`btn-ghost !py-2 ${
              post.upvotedByMe ? "!bg-accent-soft !text-accent" : ""
            }`}
          >
            {post.upvotedByMe ? (
              <ThumbUpAltIcon fontSize="small" />
            ) : (
              <ThumbUpOutlinedIcon fontSize="small" />
            )}
            {post.upvoteCount || 0}
          </button>
          <button type="button" onClick={bookmark} className="btn-ghost !py-2">
            {post.bookmarkedByMe ? (
              <BookmarkIcon fontSize="small" />
            ) : (
              <BookmarkBorderOutlinedIcon fontSize="small" />
            )}
            Save
          </button>
          <button type="button" onClick={copyLink} className="btn-ghost !py-2">
            <ContentCopyIcon fontSize="small" />
            {copied ? "Copied" : "Copy link"}
          </button>
          {(isOwner || isAdmin) && (
            <>
              <button
                type="button"
                className="btn-ghost !py-2"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              {post.postType === "question" && (
                <button
                  type="button"
                  className="btn-ghost !py-2"
                  onClick={toggleResolved}
                >
                  Mark {post.isResolved ? "open" : "resolved"}
                </button>
              )}
              <button
                type="button"
                className="btn-ghost !py-2 !text-red-600 !border-red-200"
                onClick={remove}
                disabled={busy}
              >
                <DeleteOutlineIcon fontSize="small" /> Delete
              </button>
            </>
          )}
          {isAdmin && (
            <button type="button" className="btn-ghost !py-2" onClick={pin}>
              <PushPinIcon fontSize="small" />
              {post.isPinned ? "Unpin" : "Pin"}
            </button>
          )}
        </div>
      </article>

      <section className="mt-6">
        <h2 className="font-display text-2xl text-ink mb-4">
          {sortedReplies.length}{" "}
          {sortedReplies.length === 1 ? "reply" : "replies"}
        </h2>

        <form onSubmit={submitReply} className="surface-card p-4 mb-4 space-y-3">
          <textarea
            className="field min-h-[96px]"
            placeholder={
              isAuthenticated
                ? "Share an answer or tip…"
                : "Log in to reply"
            }
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            disabled={!isAuthenticated || busy}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={!isAuthenticated || busy || !replyBody.trim()}
          >
            Post reply
          </button>
        </form>

        <ul className="space-y-3">
          {sortedReplies.map((r) => {
            const canModerateReply =
              isAdmin ||
              isOwner ||
              (user &&
                (user._id === r.authorId || String(user._id) === String(r.authorId)));
            return (
              <li
                key={r._id}
                className={`surface-card p-4 ${
                  r.isAccepted ? "border-emerald-300 ring-1 ring-emerald-200" : ""
                }`}
              >
                {r.isAccepted && (
                  <p className="text-xs font-medium text-emerald-700 mb-2 inline-flex items-center gap-1">
                    <CheckCircleIcon sx={{ fontSize: 16 }} /> Accepted answer
                  </p>
                )}
                <p className="text-xs text-accent font-medium">
                  {r.authorName} · {timeAgo(r.createdAt)}
                </p>
                <p className="text-sm text-ink-soft mt-2 whitespace-pre-wrap">
                  {r.body}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => upvoteReply(r._id)}
                    className={`btn-ghost !py-1.5 !px-3 text-xs ${
                      r.upvotedByMe ? "!bg-accent-soft !text-accent" : ""
                    }`}
                  >
                    {r.upvotedByMe ? (
                      <ThumbUpAltIcon fontSize="inherit" />
                    ) : (
                      <ThumbUpOutlinedIcon fontSize="inherit" />
                    )}
                    {r.upvoteCount || 0}
                  </button>
                  {(isOwner || isAdmin) && post.postType === "question" && (
                    <button
                      type="button"
                      onClick={() => acceptReply(r._id)}
                      className="btn-ghost !py-1.5 !px-3 text-xs"
                    >
                      {r.isAccepted ? "Unaccept" : "Accept answer"}
                    </button>
                  )}
                  {canModerateReply && (
                    <button
                      type="button"
                      onClick={() => deleteReply(r._id)}
                      className="btn-ghost !py-1.5 !px-3 text-xs !text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
