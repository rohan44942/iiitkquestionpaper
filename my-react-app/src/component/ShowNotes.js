import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { UserContext } from "../contextapi/userContext";

function ShowNotes() {
  const [notes, setNotes] = useState([]);
  const [initialNotes, setInitialNotes] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const notesPerPage = 5;
  const apiUrl = process.env.REACT_APP_API_URL;
  const sentinelRef = useRef(null);
  const { user } = useContext(UserContext);
  const admin1 = process.env.REACT_APP_ADMIN1;
  const admin2 = process.env.REACT_APP_ADMIN2;

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(`${apiUrl}/api/uploads/${type}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
          alert("Note deleted successfully.");
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete the note.");
        }
      } catch (error) {
        console.error("Error deleting the note:", error);
        alert("An error occurred while deleting the note.");
      }
    }
  };

  const fetchFiles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/upload/notes?page=${currentPage}&year=${yearFilter}&semester=${semesterFilter}&subject=${subjectFilter}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.notes)) {
        setHasMore(false);
        return;
      }

      if (currentPage === 1) {
        setNotes(data.notes);
        if (
          yearFilter === "" &&
          semesterFilter === "" &&
          subjectFilter === ""
        ) {
          setInitialNotes(data.notes);
        }
      } else {
        setNotes((prev) => [...prev, ...data.notes]);
      }

      setHasMore(data.notes.length >= notesPerPage);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMore,
    currentPage,
    yearFilter,
    semesterFilter,
    subjectFilter,
    apiUrl,
    notesPerPage,
  ]);

  // Reset state when filters change
  useEffect(() => {
    if (yearFilter === "" && semesterFilter === "" && subjectFilter === "") {
      setNotes(initialNotes);
      setHasMore(initialNotes.length >= notesPerPage);
      setCurrentPage(1);
    } else {
      setNotes([]);
      setCurrentPage(1); // This triggers the fetch effect below
      setHasMore(true);
    }
  }, [yearFilter, semesterFilter, subjectFilter, initialNotes, notesPerPage]);

  // Fetch when currentPage changes
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Set up Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loading, hasMore]);

  return (
    <div className="sm:min-h-[84vh] min-h-[78vh] pt-20 max-w-3xl mx-auto p-6 bg-gradient-to-r from-white via-gray-200 to-white">
      <h2 className="text-2xl font-bold mb-4">Notes</h2>

      <div className="mb-4">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
        >
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
        >
          <option value="">Select Semester</option>
          <option value="1st Sem">1st Sem</option>
          <option value="2nd Sem">2nd Sem</option>
        </select>

        <input
          type="text"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          placeholder="Search by Subject Name"
          className="border p-2 rounded md:mt-3"
        />
      </div>

      {notes.length === 0 && !loading ? (
        <p className="text-gray-600">No notes available</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note._id}
              className="border bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold">{note.subjectName}</h3>
              <p className="text-gray-700">
                Year: <span className="font-medium">{note.year}</span>
              </p>
              <p className="text-gray-700">
                Semester: <span className="font-medium">{note.semester}</span>
              </p>
              <p className="text-gray-700">
                Branch: <span className="font-medium">{note.branch}</span>
              </p>
              <a
                href={note.fileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline mt-2 inline-block"
              >
                View File
              </a>
              {(user?.role === "admin" ||
                user?.email === admin1 ||
                user?.email === admin2) && (
                <button
                  onClick={() => handleDelete(note._id, "notes")}
                  className="m-2 text-red-500 hover:text-red-700 underline"
                >
                  Delete Note
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <span className="loader">Loading more files...</span>
        </div>
      )}
      <div ref={sentinelRef} className="sentinel h-4 w-full" />
    </div>
  );
}

export default ShowNotes;
