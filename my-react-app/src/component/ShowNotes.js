import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { UserContext } from "../contextapi/userContext";
import { FaHeart, FaRegHeart, FaExternalLinkAlt } from "react-icons/fa";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

function ShowNotes() {
  const { user, isFavorite, toggleFavorite, isAuthenticated } =
    useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const observerRef = useRef();
  const skipSearchReset = useRef(true);
  const admin1 = process.env.REACT_APP_ADMIN1;
  const admin2 = process.env.REACT_APP_ADMIN2;

  useEffect(() => {
    if (skipSearchReset.current) {
      skipSearchReset.current = false;
      return;
    }
    const t = setTimeout(() => {
      setSubjectFilter(subjectInput.trim());
      setCurrentPage(1);
      setNotes([]);
    }, 350);
    return () => clearTimeout(t);
  }, [subjectInput]);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/uploads/${type}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note._id !== id));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete the note.");
      }
    } catch (error) {
      alert("An error occurred while deleting the note.");
    }
  };

  const fetchFiles = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (yearFilter) params.set("year", yearFilter);
        if (semesterFilter) params.set("semester", semesterFilter);
        if (branchFilter) params.set("branch", branchFilter);
        if (subjectFilter) params.set("subject", subjectFilter);

        const response = await fetch(`${apiUrl}/api/upload/notes?${params}`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setNotes((prev) => (page === 1 ? data.notes : [...prev, ...data.notes]));
        setHasMore(Boolean(data.hasMore));
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    },
    [yearFilter, semesterFilter, branchFilter, subjectFilter, apiUrl]
  );

  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage, fetchFiles]);

  const observer = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading && hasMore) {
            setCurrentPage((prev) => prev + 1);
          }
        },
        { root: null, rootMargin: "80px", threshold: 0.2 }
      );
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const onFavorite = async (note) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    await toggleFavorite({
      resourceId: note._id,
      resourceType: "note",
      title: note.subjectName,
      meta: `${note.year || ""} · ${note.semester || ""}`,
    });
  };

  return (
    <div className="page-shell max-w-4xl">
      <div className="mb-8 animate-fadeUp">
        <h1 className="page-title">Study notes</h1>
        <p className="page-subtitle">
          Subject notes curated by seniors — filter by year and semester, then
          open the file instantly.
        </p>
      </div>

      <div className="surface-card p-4 mb-6 animate-fadeUp">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setCurrentPage(1);
              setNotes([]);
            }}
            className="field"
          >
            <option value="">All years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          <select
            value={semesterFilter}
            onChange={(e) => {
              setSemesterFilter(e.target.value);
              setCurrentPage(1);
              setNotes([]);
            }}
            className="field"
          >
            <option value="">All semesters</option>
            <option value="1st Sem">1st Sem</option>
            <option value="2nd Sem">2nd Sem</option>
          </select>
          <select
            value={branchFilter}
            onChange={(e) => {
              setBranchFilter(e.target.value);
              setCurrentPage(1);
              setNotes([]);
            }}
            className="field"
          >
            <option value="">All branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="AI">AI</option>
          </select>
          <label className="relative">
            <SearchOutlinedIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              fontSize="small"
            />
            <input
              type="search"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Search subject…"
              className="field !pl-10"
            />
          </label>
        </div>
      </div>

      {notes.length === 0 && !loading ? (
        <div className="surface-card p-12 text-center">
          <p className="font-display text-xl">No notes yet</p>
          <p className="text-sm text-ink-muted mt-2">
            Be the first to{" "}
            <a href="/upload" className="text-accent underline">
              share notes
            </a>
            .
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {notes.map((note, index) => {
            const favorited = isFavorite(note._id, "note");
            return (
              <li
                key={note._id}
                ref={index === notes.length - 1 ? observer : null}
                className="surface-card p-5 animate-fadeUp"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl text-ink">
                      {note.subjectName}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {note.year && <span className="chip">{note.year}</span>}
                      {note.semester && (
                        <span className="chip !bg-paper !text-ink-muted">
                          {note.semester}
                        </span>
                      )}
                      {note.branch && (
                        <span className="chip !bg-paper !text-ink-muted">
                          {note.branch}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onFavorite(note)}
                    className="h-9 w-9 rounded-full border border-paper-line flex items-center justify-center text-accent hover:bg-accent-soft transition"
                    aria-label="Toggle favorite"
                  >
                    {favorited ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={note.fileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !py-2 !px-3 text-xs"
                  >
                    <FaExternalLinkAlt /> Open file
                  </a>
                  {(user?.role === "admin" ||
                    user?.email === admin1 ||
                    user?.email === admin2) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(note._id, "notes")}
                      className="btn-ghost !py-2 !px-3 text-xs !text-red-600 !border-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {loading && (
        <p className="text-center text-ink-muted mt-6 text-sm">
          {currentPage === 1 ? "Loading notes…" : "Loading more…"}
        </p>
      )}
    </div>
  );
}

export default ShowNotes;
