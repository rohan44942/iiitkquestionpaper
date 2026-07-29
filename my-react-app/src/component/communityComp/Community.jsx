import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contextapi/userContext";
import PostCard from "./PostCard";
import {
  COMMUNITY_TAGS,
  POST_TYPES,
  SORT_OPTIONS,
  requireAuth,
} from "./communityUtils";

const emptyForm = {
  title: "",
  body: "",
  tag: "General",
  postType: "question",
};

export default function Community() {
  const { isAuthenticated, user } = useContext(UserContext);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [tag, setTag] = useState("");
  const [postType, setPostType] = useState("");
  const [sort, setSort] = useState("newest");
  const [status, setStatus] = useState("");
  const [unanswered, setUnanswered] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, tag, postType, sort, status, unanswered, bookmarkedOnly]);

  const buildParams = useCallback(
    (pageNum) => {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: "10",
        sort,
      });
      if (debouncedQ) params.set("q", debouncedQ);
      if (tag) params.set("tag", tag);
      if (postType) params.set("postType", postType);
      if (status) params.set("status", status);
      if (unanswered) params.set("unanswered", "true");
      if (bookmarkedOnly) params.set("bookmarked", "true");
      return params;
    },
    [debouncedQ, tag, postType, sort, status, unanswered, bookmarkedOnly]
  );

  const loadPosts = useCallback(
    async (pageNum, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/api/community?${buildParams(pageNum)}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load posts");
        const data = await res.json();
        setPosts((prev) =>
          append ? [...prev, ...(data.posts || [])] : data.posts || []
        );
        setHasMore(Boolean(data.hasMore));
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
        if (!append) setPosts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [apiUrl, buildParams]
  );

  useEffect(() => {
    loadPosts(page, page > 1);
  }, [page, loadPosts]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/community/stats`);
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, [apiUrl]);

  const replacePost = (updated) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const upvote = async (id) => {
    if (!requireAuth(isAuthenticated)) return;
    const res = await fetch(`${apiUrl}/api/community/${id}/upvote`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.post) replacePost(data.post);
  };

  const bookmark = async (id) => {
    if (!requireAuth(isAuthenticated)) return;
    const res = await fetch(`${apiUrl}/api/community/${id}/bookmark`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.post) {
      if (bookmarkedOnly && !data.bookmarked) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      } else {
        replacePost(data.post);
      }
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!requireAuth(isAuthenticated)) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/community`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not create post");
        return;
      }
      setForm(emptyForm);
      setComposerOpen(false);
      setSort("newest");
      setPage(1);
      await loadPosts(1, false);
      const statsRes = await fetch(`${apiUrl}/api/community/stats`);
      if (statsRes.ok) setStats(await statsRes.json());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fadeUp">
        <div>
          <h1 className="page-title">Community</h1>
          <p className="page-subtitle">
            Campus Q&amp;A — ask doubts, mark best answers, bookmark threads, and
            help juniors.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary self-start"
          onClick={() => {
            if (!requireAuth(isAuthenticated)) return;
            setComposerOpen((v) => !v);
          }}
        >
          {composerOpen ? "Close composer" : "New post"}
        </button>
      </div>

      {stats?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fadeUp">
          {[
            ["Threads", stats.stats.posts],
            ["Questions", stats.stats.questions],
            ["Resolved", stats.stats.resolved],
            ["Replies", stats.stats.replies],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl bg-white border border-paper-line p-4 text-center shadow-soft"
            >
              <p className="font-display text-2xl text-ink">{value || 0}</p>
              <p className="text-[11px] uppercase tracking-wide text-ink-muted mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {composerOpen && (
        <form
          onSubmit={createPost}
          className="surface-card p-5 mb-6 space-y-3 animate-fadeUp"
        >
          <h2 className="font-display text-xl text-ink">Start a thread</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              className="field"
              value={form.postType}
              onChange={(e) =>
                setForm((f) => ({ ...f, postType: e.target.value }))
              }
            >
              {POST_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className="field"
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
            >
              {COMMUNITY_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <input
            className="field"
            placeholder="Clear title (e.g. DSA midterm recursion doubt)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            maxLength={160}
          />
          <textarea
            className="field min-h-[140px] resize-y"
            placeholder="Explain the problem, what you tried, and where you're stuck…"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            required
            maxLength={8000}
          />
          <div className="flex justify-between items-center gap-3">
            <p className="text-xs text-ink-muted">
              Tip: use Question for doubts so others can accept a best answer.
            </p>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? "Publishing…" : "Publish"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <section className="space-y-4 min-w-0">
          <div className="surface-card p-4 space-y-3">
            <input
              className="field"
              placeholder="Search title, body, author, tag…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <select
                className="field"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                className="field"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="">All tags</option>
                {COMMUNITY_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                className="field"
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
              >
                <option value="">All types</option>
                {POST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select
                className="field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Open + resolved</option>
                <option value="open">Open only</option>
                <option value="resolved">Resolved only</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setUnanswered((v) => !v)}
                className={`btn-ghost !py-1.5 !px-3 text-xs ${
                  unanswered ? "!bg-accent-soft !text-accent" : ""
                }`}
              >
                Unanswered
              </button>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setBookmarkedOnly((v) => !v)}
                  className={`btn-ghost !py-1.5 !px-3 text-xs ${
                    bookmarkedOnly ? "!bg-accent-soft !text-accent" : ""
                  }`}
                >
                  My bookmarks
                </button>
              )}
              <span className="text-xs text-ink-muted self-center ml-auto">
                {total} thread{total === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {loading && page === 1 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-36" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="surface-card p-10 text-center">
              <p className="font-display text-xl">No threads match</p>
              <p className="text-sm text-ink-muted mt-2">
                Clear filters or create the first post.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpvote={upvote}
                onBookmark={bookmark}
              />
            ))
          )}

          {hasMore && (
            <button
              type="button"
              className="btn-ghost w-full"
              disabled={loadingMore}
              onClick={() => setPage((p) => p + 1)}
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
          <div className="surface-card p-5">
            <h3 className="font-display text-lg text-ink mb-3">Trending tags</h3>
            <div className="flex flex-wrap gap-2">
              {(stats?.tags?.length
                ? stats.tags
                : COMMUNITY_TAGS.slice(0, 6).map((t) => ({ tag: t, count: 0 }))
              ).map((t) => (
                <button
                  key={t.tag}
                  type="button"
                  onClick={() => setTag(t.tag === tag ? "" : t.tag)}
                  className={`chip !cursor-pointer ${
                    tag === t.tag ? "!bg-accent !text-white" : ""
                  }`}
                >
                  {t.tag}
                  {t.count ? ` · ${t.count}` : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="surface-card p-5">
            <h3 className="font-display text-lg text-ink mb-3">How it works</h3>
            <ul className="text-sm text-ink-muted space-y-2 list-disc list-inside">
              <li>Ask as a Question for best-answer flow</li>
              <li>Upvote useful replies; author can Accept</li>
              <li>Bookmark threads for revision</li>
              <li>Admins can pin important notices</li>
            </ul>
            {!isAuthenticated && (
              <Link to="/login" className="btn-primary w-full mt-4">
                Login to participate
              </Link>
            )}
            {isAuthenticated && (
              <p className="text-xs text-ink-muted mt-3">
                Signed in as {user?.fullName?.split(" ")[0] || "student"}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
