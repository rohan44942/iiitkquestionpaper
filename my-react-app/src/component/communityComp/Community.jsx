import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../contextapi/userContext";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

const TAGS = ["General", "CSE", "ECE", "AI", "Placements", "Doubt"];

export default function Community() {
  const { isAuthenticated, user } = useContext(UserContext);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState("");
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ title: "", body: "", tag: "General" });
  const [replyDrafts, setReplyDrafts] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tag) params.set("tag", tag);
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`${apiUrl}/api/community?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, tag, q]);

  useEffect(() => {
    const t = setTimeout(loadPosts, 250);
    return () => clearTimeout(t);
  }, [loadPosts]);

  const createPost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/community`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Could not create post");
        return;
      }
      setForm({ title: "", body: "", tag: "General" });
      await loadPosts();
    } finally {
      setSubmitting(false);
    }
  };

  const upvote = async (id) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    const res = await fetch(`${apiUrl}/api/community/${id}/upvote`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();
    setPosts((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              upvotes: data.upvoted
                ? [...(p.upvotes || []), user?._id]
                : (p.upvotes || []).filter((u) => u !== user?._id),
            }
          : p
      )
    );
  };

  const reply = async (id) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    const body = replyDrafts[id]?.trim();
    if (!body) return;
    const res = await fetch(`${apiUrl}/api/community/${id}/replies`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setPosts((prev) => prev.map((p) => (p._id === id ? data.post : p)));
    setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="page-shell">
      <div className="mb-8 animate-fadeUp">
        <h1 className="page-title">Community</h1>
        <p className="page-subtitle">
          Ask doubts, share tips, and help juniors — course tags keep threads
          easy to find.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <section className="space-y-4">
          <div className="surface-card p-4 flex flex-col sm:flex-row gap-3">
            <input
              className="field"
              placeholder="Search posts…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="field sm:max-w-[10rem]"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">All tags</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-36" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="surface-card p-10 text-center">
              <p className="font-display text-xl">No posts yet</p>
              <p className="text-sm text-ink-muted mt-2">
                Start the first thread from the composer.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post._id} className="surface-card p-5 animate-fadeUp">
                <div className="flex items-center gap-2 mb-2">
                  <span className="chip">{post.tag || "General"}</span>
                  <span className="text-xs text-ink-muted">
                    {post.authorName} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <h2 className="font-display text-xl text-ink">{post.title}</h2>
                <p className="text-sm text-ink-soft mt-2 whitespace-pre-wrap">
                  {post.body}
                </p>

                <div className="mt-4 flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => upvote(post._id)}
                    className="btn-ghost !py-1.5 !px-3 text-xs"
                  >
                    <ThumbUpOutlinedIcon fontSize="inherit" />
                    {post.upvotes?.length || 0}
                  </button>
                  <span className="text-ink-muted inline-flex items-center gap-1 text-xs">
                    <ChatBubbleOutlineOutlinedIcon fontSize="inherit" />
                    {post.replies?.length || 0} replies
                  </span>
                </div>

                {post.replies?.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-paper-line pt-3">
                    {post.replies.map((r) => (
                      <li
                        key={r._id || `${r.authorName}-${r.createdAt}`}
                        className="rounded-xl bg-paper px-3 py-2"
                      >
                        <p className="text-xs font-medium text-accent">
                          {r.authorName}
                        </p>
                        <p className="text-sm text-ink-soft mt-0.5">{r.body}</p>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-3 flex gap-2">
                  <input
                    className="field"
                    placeholder={
                      isAuthenticated ? "Write a reply…" : "Login to reply"
                    }
                    value={replyDrafts[post._id] || ""}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    disabled={!isAuthenticated}
                  />
                  <button
                    type="button"
                    className="btn-primary !px-4"
                    onClick={() => reply(post._id)}
                    disabled={!isAuthenticated}
                  >
                    Reply
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="lg:sticky lg:top-20 h-fit">
          <form onSubmit={createPost} className="surface-card p-5 space-y-3 animate-fadeUp">
            <h2 className="font-display text-xl text-ink">New post</h2>
            {!isAuthenticated && (
              <p className="text-xs text-ink-muted">
                <a href="/login" className="text-accent underline">
                  Log in
                </a>{" "}
                to ask a question or share a tip.
              </p>
            )}
            <input
              className="field"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              disabled={!isAuthenticated}
            />
            <textarea
              className="field min-h-[120px] resize-y"
              placeholder="What do you need help with?"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              required
              disabled={!isAuthenticated}
            />
            <select
              className="field"
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              disabled={!isAuthenticated}
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!isAuthenticated || submitting}
            >
              {submitting ? "Posting…" : "Publish"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
