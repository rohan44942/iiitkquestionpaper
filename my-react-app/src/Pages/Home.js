import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaDownload, FaEye, FaTrash } from "react-icons/fa";
import { UserContext } from "../contextapi/userContext";

function Home() {
  const { user } = useContext(UserContext); // Context to get user role
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const apiUrl = process.env.REACT_APP_API_URL;
  const admin1 = process.env.REACT_APP_ADMIN1;
  const admin2 = process.env.REACT_APP_ADMIN2;
  const fetchFiles = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/uploads/?page=${page}&limit=10&year=${yearFilter}&branch=${branchFilter}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles((prev) => [...prev, ...data.files]);
      setHasMore(data.files.length > 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        const response = await fetch(`${apiUrl}/api/uploads/${type}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          // Remove the deleted file from the files state
          setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
          alert("File deleted successfully.");
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete file.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the file.");
      }
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
        { root: null, rootMargin: "20px", threshold: 1.0 }
      );
      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage, yearFilter, branchFilter]);

  const filteredFiles = files.filter((file) => {
    return (
      (yearFilter ? file.metadata.year === yearFilter : true) &&
      (branchFilter ? file.metadata.branch === branchFilter : true)
    );
  });

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="bg-cream pt-20 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-light-green">
        IIITK Resource Files
      </h1>

      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setCurrentPage(1);
            setFiles([]);
          }}
          className="border rounded-lg p-2 bg-white"
        >
          <option value="">All Years</option>
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
          className="border rounded-lg p-2 bg-white"
        >
          <option value="">All Branches</option>
          <option value="cse">Computer Science Engineering</option>
          <option value="ece">Electronics and Communication Engineering</option>
          <option value="ai">Artificial Intelligence</option>
        </select>
      </div>

      {isLoading && currentPage === 1 ? (
        <div className="flex justify-center items-center h-48">
          <span className="loader">Loading files...</span>
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredFiles.reverse().map((file, index) => (
            <div
              key={file._id}
              ref={index === filteredFiles.length - 1 ? observer : null}
              className="border rounded-lg shadow-lg p-6 bg-gray-50 flex flex-col"
            >
              <div className="flex-shrink-0 mb-4">
                {file.filename.endsWith(".pdf") ? (
                  <iframe
                    title="PDF Preview"
                    style={{ display: "block" }}
                    className="w-full h-48 border-none overflow-hidden"
                    src={`${apiUrl}/api/uploads/${file.filename}`}
                    loading="lazy"
                  />
                ) : (
                  <LazyLoadImage
                    alt={file.filename}
                    effect="blur"
                    className="w-full h-48 object-cover cursor-pointer rounded hover:opacity-80 shadow"
                    src={`${apiUrl}/api/uploads/${file.filename}`}
                  />
                )}
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-light-green hover:underline">
                  <a
                    href={`${apiUrl}/api/uploads/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.metadata.fileName || file.filename}
                  </a>
                </h3>
                <p className="text-gray-500 text-sm">
                  Description: {file.metadata.description || "No description"}
                </p>
                <p className="text-gray-500 text-sm">
                  Year: {file.metadata.year}
                </p>
                <p className="text-gray-500 text-sm">
                  Branch: {file.metadata.branch}
                </p>
                <p className="text-gray-500 text-sm">
                  Uploaded by: {file.metadata.uploadedBy || "A Helper"}
                </p>
                <p className="text-gray-500 text-sm">
                  Uploaded on:{" "}
                  {new Date(file.uploadDate).toLocaleDateString("en-CA")}
                </p>
                <p className="text-gray-500 text-sm">
                  File Size: {(file.length / 1000).toFixed(2)} Kb
                </p>

                <div className="mt-4 flex flex-col space-y-2">
                  <a
                    href={`${apiUrl}/api/download/${file.filename}`}
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <FaDownload className="mr-1" /> Download
                  </a>
                  <a
                    href={`${apiUrl}/api/uploads/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <FaEye className="mr-1" /> View
                  </a>
                  {(user?.role === "admin" ||
                    user?.email === admin1 ||
                    user?.email === admin2) && (
                    <button
                      onClick={() => handleDelete(file._id, "exam")}
                      className="flex items-center text-red-500 hover:underline"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No files found</div>
      )}

      {isLoading && currentPage > 1 && (
        <div className="flex justify-center items-center mt-4">
          <span className="loader">Loading more files...</span>
        </div>
      )}
    </div>
  );
}

export default Home;
