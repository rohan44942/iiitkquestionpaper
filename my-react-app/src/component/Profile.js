import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contextapi/userContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useContext(UserContext);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const res = await fetch(`${apiUrl}/user/stats`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [isAuthenticated, apiUrl]);

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="skeleton h-48 max-w-xl mx-auto" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const favorites = user.favorites || [];

  return (
    <div className="page-shell max-w-3xl">
      <div className="surface-card p-6 sm:p-8 animate-fadeUp">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={user.profilePic || "/profilePic.png"}
            alt={user.fullName}
            className="rounded-2xl w-24 h-24 object-cover border border-paper-line"
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-display text-3xl text-ink">{user.fullName}</h1>
            <p className="text-ink-muted text-sm mt-1">{user.email}</p>
            <span className="chip mt-3 inline-flex capitalize">{user.role}</span>
            <p className="text-sm text-ink-soft mt-4 max-w-md">
              Upload papers and notes for juniors. After admin approval they
              appear on the public feed. Sharing compounds campus knowledge.
            </p>
          </div>
          <button type="button" onClick={logout} className="btn-ghost self-start">
            Logout
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              ["Papers", stats.papersAccepted],
              ["Notes", stats.notesAccepted],
              ["Uploads", stats.papersUploaded + stats.notesUploaded],
              ["Saved", stats.favoritesCount],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl bg-paper border border-paper-line p-4 text-center"
              >
                <p className="font-display text-2xl text-ink">{value}</p>
                <p className="text-xs text-ink-muted mt-1 uppercase tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-8 border-b border-paper-line">
          {["overview", "saved"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm capitalize border-b-2 transition ${
                tab === t
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="mt-5 space-y-3 text-sm text-ink-soft">
            <p>
              Quick links:{" "}
              <Link to="/upload" className="text-accent underline">
                Upload
              </Link>
              ,{" "}
              <Link to="/" className="text-accent underline">
                Papers
              </Link>
              ,{" "}
              <Link to="/community" className="text-accent underline">
                Community
              </Link>
              .
            </p>
            <p>
              Tip: use the heart on any paper or note to build your revision
              list here.
            </p>
          </div>
        )}

        {tab === "saved" && (
          <div className="mt-5">
            {favorites.length === 0 ? (
              <p className="text-sm text-ink-muted">
                No favorites yet. Heart a resource while browsing.
              </p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((f) => (
                  <li
                    key={`${f.resourceType}-${f.resourceId}`}
                    className="rounded-xl border border-paper-line bg-paper px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-ink text-sm">{f.title}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {f.resourceType}
                        {f.meta ? ` · ${f.meta}` : ""}
                      </p>
                    </div>
                    <Link
                      to={f.resourceType === "note" ? "/notes" : "/"}
                      className="text-xs text-accent underline"
                    >
                      Browse
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
