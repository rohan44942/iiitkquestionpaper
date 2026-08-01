import { useState } from "react";

const api_uri = process.env.REACT_APP_API_URL;

function MakeAdmin() {
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${api_uri}/user/data?email=${encodeURIComponent(email.trim())}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("User not found or an error occurred.");
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async () => {
    if (!userData) return;
    const newRole = userData.user.role === "admin" ? "user" : "admin";

    try {
      setUpdatingRole(true);
      setError(null);

      const response = await fetch(`${api_uri}/user/changeRole`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: userData.user.email, role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role.");
      }

      setUserData((prevData) => ({
        ...prevData,
        user: { ...prevData.user, role: newRole },
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleClick = () => {
    if (email.trim() === "") {
      setError("Please enter a valid email address.");
      return;
    }
    fetchUser();
  };

  const currentRole = userData?.user?.role;

  return (
    <section className="surface-card p-6 sm:p-8">
      <h2 className="font-display text-2xl text-ink">Make admin</h2>
      <p className="text-sm text-ink-muted mt-1 mb-5">
        Search a user by email, then promote or remove admin access.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          className="field sm:flex-1"
        />
        <button type="button" className="btn-primary shrink-0" onClick={handleClick}>
          Search
        </button>
      </div>

      {loading && (
        <p className="text-sm text-ink-muted text-center mt-4">Searching…</p>
      )}
      {error && (
        <p className="text-sm text-red-600 text-center mt-4">{error}</p>
      )}

      {userData && (
        <div className="mt-5 rounded-2xl border border-paper-line bg-paper p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-display text-lg text-ink">
                {userData.user.fullName}
              </p>
              <p className="text-sm text-ink-muted mt-0.5">
                {userData.user.email}
              </p>
              <span className="chip mt-2 capitalize">{currentRole}</span>
            </div>
            <button
              type="button"
              className={
                currentRole === "admin"
                  ? "btn-ghost text-red-600 hover:border-red-300 hover:text-red-700"
                  : "btn-primary"
              }
              onClick={handleRoleToggle}
              disabled={updatingRole}
            >
              {updatingRole
                ? "Updating…"
                : currentRole === "admin"
                  ? "Remove admin"
                  : "Make admin"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default MakeAdmin;
