import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { UserContext } from "../contextapi/userContext";

function ShowNotes() {
  const { user } = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  // const [initialNotes, setInitialNotes] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const observerRef = useRef();
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

  const fetchFiles = useCallback(
    async (currentPage) => {
      // if (loading || !hasMore) return;

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

        setNotes((prev) => [...prev, ...data.notes]);
        setHasMore(data.notes.length > 0);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    },
    [yearFilter, semesterFilter, subjectFilter, apiUrl]
  );

  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage, fetchFiles]);

  const observer = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      console.log("running", hasMore, loading);
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading && hasMore) {
            setCurrentPage((prev) => prev + 1);
          }
        },
        { root: null, rootMargin: "20px", threshold: 1.0 }
      );
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="sm:min-h-[84vh] min-h-[78vh] pt-20 max-w-3xl mx-auto p-6 bg-gradient-to-r from-white via-gray-200 to-white">
      <h2 className="text-2xl font-bold mb-4">Notes</h2>

      <div className="mb-4">
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setCurrentPage(1);
            setNotes([]);
          }}
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
          onChange={(e) => {
            setSemesterFilter(e.target.value);
            setCurrentPage(1);
            setNotes([]);
          }}
          className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
        >
          <option value="">Select Semester</option>
          <option value="1st Sem">1st Sem</option>
          <option value="2nd Sem">2nd Sem</option>
        </select>

        <input
          type="text"
          value={subjectFilter}
          onChange={(e) => {
            setSubjectFilter(e.target.value);
            setCurrentPage(1);
            setNotes([]);
          }}
          placeholder="Search by Subject Name"
          className="border p-2 rounded md:mt-3"
        />
      </div>

      {notes.length === 0 && !loading ? (
        <p className="text-gray-600">No notes available</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note, index) => (
            <li
              key={note._id}
              ref={index === notes.length - 1 ? observer : null}
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

      {loading && currentPage > 1 && (
        <div className="flex justify-center items-center mt-4">
          <span className="loader">Loading more files...</span>
        </div>
      )}
    </div>
  );
}

export default ShowNotes;
