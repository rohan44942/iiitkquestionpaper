import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { UserContext } from "../contextapi/userContext";
import QPaper from "../component/QPaper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

function Home() {
  const { user } = useContext(UserContext);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalFiles, setTotalFiles] = useState(0);
  const observerRef = useRef();
  const apiUrl = process.env.REACT_APP_API_URL;
  const admin1 = process.env.REACT_APP_ADMIN1;
  const admin2 = process.env.REACT_APP_ADMIN2;

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
      setFiles([]);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchFiles = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
        });
        if (yearFilter) params.set("year", yearFilter);
        if (branchFilter) params.set("branch", branchFilter);
        if (searchQuery) params.set("q", searchQuery);

        const response = await fetch(`${apiUrl}/api/uploads/?${params}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch files");
        const data = await response.json();
        setFiles((prev) => (page === 1 ? data.files : [...prev, ...data.files]));
        setHasMore(data.currentPage < data.totalPages);
        setTotalFiles(data.totalFiles || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl, yearFilter, branchFilter, searchQuery]
  );

  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/uploads/${type}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setFiles((prev) => prev.filter((file) => file._id !== id));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete file.");
      }
    } catch (error) {
      alert("An error occurred while deleting the file.");
    }
  };

  const observer = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        },
        { root: null, rootMargin: "80px", threshold: 0.2 }
      );
      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage, fetchFiles]);

  if (error) {
    return (
      <div className="page-shell">
        <div className="surface-card p-8 text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-8 animate-fadeUp">
        <h1 className="page-title">Question papers</h1>
        <p className="page-subtitle">
          Browse midterms and endterms by semester and branch. Save what you need
          for later — {totalFiles || "many"} papers already shared by students.
        </p>
      </div>

      <div className="surface-card p-4 mb-6 animate-fadeUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="relative md:col-span-1">
            <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" fontSize="small" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search subject, file, description…"
              className="field !pl-10"
            />
          </label>
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setCurrentPage(1);
              setFiles([]);
            }}
            className="field"
          >
            <option value="">All exams</option>
            <option value="1st sem midterm">1st Sem Mid-Term</option>
            <option value="1st sem endterm">1st Sem End-Term</option>
            <option value="2nd sem midterm">2nd Sem Mid-Term</option>
            <option value="2nd sem endterm">2nd Sem End-Term</option>
            <option value="3rd sem midterm">3rd Sem Mid-Term</option>
            <option value="3rd sem endterm">3rd Sem End-Term</option>
            <option value="4th sem midterm">4th Sem Mid-Term</option>
            <option value="4th sem endterm">4th Sem End-Term</option>
            <option value="5th sem midterm">5th Sem Mid-Term</option>
            <option value="5th sem endterm">5th Sem End-Term</option>
            <option value="6th sem midterm">6th Sem Mid-Term</option>
            <option value="6th sem endterm">6th Sem End-Term</option>
            <option value="7th sem midterm">7th Sem Mid-Term</option>
            <option value="7th sem endterm">7th Sem End-Term</option>
            <option value="8th sem midterm">8th Sem Mid-Term</option>
            <option value="8th sem endterm">8th Sem End-Term</option>
            <option value="supplementary sem midterm">Supplementary</option>
          </select>
          <select
            value={branchFilter}
            onChange={(e) => {
              setBranchFilter(e.target.value);
              setCurrentPage(1);
              setFiles([]);
            }}
            className="field"
          >
            <option value="">All branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="AI">AI</option>
          </select>
        </div>
      </div>

      {isLoading && currentPage === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-72" />
          ))}
        </div>
      ) : files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {files.map((file, index) => (
            <QPaper
              key={file._id}
              data={{
                file,
                apiUrl,
                user,
                admin1,
                admin2,
                observer: index === files.length - 1 ? observer : null,
                handleDelete,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="surface-card p-12 text-center">
          <p className="font-display text-xl text-ink">No papers found</p>
          <p className="text-ink-muted mt-2 text-sm">
            Try another filter, or{" "}
            <a href="/upload" className="text-accent underline">
              upload one
            </a>{" "}
            for your juniors.
          </p>
        </div>
      )}

      {isLoading && currentPage > 1 && (
        <p className="text-center text-ink-muted mt-6 text-sm">Loading more…</p>
      )}
    </div>
  );
}

export default Home;
