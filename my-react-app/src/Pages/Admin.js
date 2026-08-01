import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import MakeAdmin from "../component/MakeAdmin";
import { UserContext } from "../contextapi/userContext";

const api = process.env.REACT_APP_API_URL;

function Admin() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } =
    useContext(UserContext);
  const [pendingExamUploads, setPendingExamUploads] = useState([]);
  const [pendingNotesUploads, setPendingNotesUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !isAdmin) {
      setLoading(false);
      return;
    }

    const fetchPendingExamUploads = async () => {
      const res = await fetch(`${api}/api/uploads/status/pending/papers`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          "Unauthorized access or session expired. Please log in again."
        );
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Failed to load pending exam uploads.");
      }
      setPendingExamUploads(data);
    };

    const fetchPendingNotesUploads = async () => {
      const res = await fetch(`${api}/api/uploads/status/pending/notes`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(
          "Unauthorized access or session expired. Please log in again."
        );
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Failed to load pending notes uploads.");
      }
      setPendingNotesUploads(data);
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchPendingExamUploads(),
          fetchPendingNotesUploads(),
        ]);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, isAuthenticated, isAdmin]);

  const declineUpload = async (id, type) => {
    setActionId(id);
    try {
      const res = await fetch(`${api}/api/uploads/${type}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to decline upload.");
      if (type === "exam") {
        setPendingExamUploads((prev) => prev.filter((u) => u._id !== id));
      } else {
        setPendingNotesUploads((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to decline upload.");
    } finally {
      setActionId(null);
    }
  };

  const acceptUpload = async (id, type) => {
    setActionId(id);
    try {
      const res = await fetch(`${api}/api/uploads/status/accept/${type}/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to accept upload.");
      if (type === "exam") {
        setPendingExamUploads((prev) => prev.filter((u) => u._id !== id));
      } else {
        setPendingNotesUploads((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to accept upload.");
    } finally {
      setActionId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="page-shell">
        <div className="skeleton h-64 max-w-3xl mx-auto" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="page-shell max-w-lg">
        <div className="surface-card p-10 text-center animate-fadeUp">
          <h1 className="page-title text-2xl sm:text-3xl">Admin only</h1>
          <p className="page-subtitle mx-auto">
            {!isAuthenticated
              ? "Sign in with an admin account to review uploads and manage roles."
              : "Your account does not have admin access."}
          </p>
          <NavLink to={isAuthenticated ? "/" : "/login"} className="btn-primary mt-6">
            {isAuthenticated ? "Back to home" : "Go to login"}
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell max-w-4xl">
      <div className="mb-8 animate-fadeUp">
        <h1 className="page-title">Admin</h1>
        <p className="page-subtitle">
          Approve pending papers and notes, and promote trusted users to admin.
        </p>
      </div>

      <div className="space-y-8 animate-fadeUp">
        <MakeAdmin />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-36" />
            <div className="skeleton h-36" />
          </div>
        ) : (
          <>
            <PendingSection
              title="Pending exam papers"
              empty="No pending exam papers."
              items={pendingExamUploads}
              actionId={actionId}
              onAccept={(id) => acceptUpload(id, "exam")}
              onDecline={(id) => declineUpload(id, "exam")}
              renderMeta={(upload) => (
                <>
                  <h3 className="font-display text-xl text-ink">
                    {upload.metadata?.fileName || "Untitled paper"}
                  </h3>
                  <p className="text-sm text-ink-muted mt-1">
                    Year / semester: {upload.metadata?.year}
                  </p>
                  <p className="text-sm text-ink-muted">
                    Branch: {upload.metadata?.branch}
                  </p>
                  {upload.metadata?.description && (
                    <p className="text-sm text-ink-soft mt-2">
                      {upload.metadata.description}
                    </p>
                  )}
                  {upload.uploadDate && (
                    <p className="text-xs text-ink-muted mt-2">
                      Uploaded {new Date(upload.uploadDate).toLocaleString()}
                    </p>
                  )}
                </>
              )}
              previewHref={(upload) => `${api}/api/uploads/${upload.filename}`}
              previewLabel="Preview paper"
            />

            <PendingSection
              title="Pending notes"
              empty="No pending notes."
              items={pendingNotesUploads}
              actionId={actionId}
              onAccept={(id) => acceptUpload(id, "notes")}
              onDecline={(id) => declineUpload(id, "notes")}
              renderMeta={(upload) => (
                <>
                  <h3 className="font-display text-xl text-ink">
                    {upload.subjectName || "Untitled notes"}
                  </h3>
                  <p className="text-sm text-ink-muted mt-1">
                    Year / semester: {upload.year}
                  </p>
                  <p className="text-sm text-ink-muted">Branch: {upload.branch}</p>
                  {upload.description && (
                    <p className="text-sm text-ink-soft mt-2">
                      {upload.description}
                    </p>
                  )}
                </>
              )}
              previewHref={(upload) => upload.fileLink}
              previewLabel="Preview notes"
            />
          </>
        )}
      </div>
    </div>
  );
}

function PendingSection({
  title,
  empty,
  items,
  actionId,
  onAccept,
  onDecline,
  renderMeta,
  previewHref,
  previewLabel,
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        <span className="chip">{items.length} pending</span>
      </div>

      {items.length === 0 ? (
        <div className="surface-card p-6 text-sm text-ink-muted">{empty}</div>
      ) : (
        <ul className="space-y-4">
          {items.map((upload) => {
            const busy = actionId === upload._id;
            const href = previewHref(upload);
            return (
              <li key={upload._id} className="surface-card p-5 sm:p-6">
                {renderMeta(upload)}
                <div className="flex flex-wrap items-center gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => onAccept(upload._id)}
                    disabled={busy}
                    className="btn-primary disabled:opacity-60"
                  >
                    {busy ? "Working…" : "Accept"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline(upload._id)}
                    disabled={busy}
                    className="btn-ghost text-red-600 hover:border-red-300 hover:text-red-700 disabled:opacity-60"
                  >
                    Decline
                  </button>
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost ml-auto"
                    >
                      {previewLabel}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Admin;
