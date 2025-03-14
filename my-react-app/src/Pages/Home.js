import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { UserContext } from "../contextapi/userContext";
import QPaper from "../component/QPaper";

function Home() {
  const { user } = useContext(UserContext);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [takingtime, setTakingTime] = useState(false);
  const observerRef = useRef();
  // urls
  const apiUrl = process.env.REACT_APP_API_URL;
  const admin1 = process.env.REACT_APP_ADMIN1;
  const admin2 = process.env.REACT_APP_ADMIN2;
  // if wait is longer the ususal
  const timeout = () => {
    setTimeout(() => {
      setTakingTime(true);
      // show the message or animation of hold one data is coming
    }, 100000);
  };
  const fetchFiles = useCallback(
    async (page) => {
      setIsLoading(true);
      timeout();
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
    },
    [apiUrl, yearFilter, branchFilter]
  );

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

  // useEffect(() => {
  //   fetchFiles(currentPage);
  // }, [currentPage, yearFilter, branchFilter]);
  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage, fetchFiles]);

  // const filteredFiles = files.filter((file) => {
  //   return (
  //     (yearFilter ? file.metadata.year === yearFilter : true) &&
  //     (branchFilter ? file.metadata.branch === branchFilter : true)
  //   );
  // });

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-white via-gray-200 to-white overflow-scroll ">
      <h1 className="text-4xl font-bold mb-6 text-center text-light-green">
        <span className="text-zinc-900 block sm:inline">
          IIITK
          <span className="block sm:inline"> Resource Files</span>
        </span>
      </h1>

      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setCurrentPage(1);
            setFiles([]);
          }}
          className="border rounded-2xl p-2 bg-white"
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
          className="border rounded-2xl p-2 bg-white"
        >
          <option value="">All Branches</option>
          <option value="CSE">Computer Science Engineering</option>
          <option value="ECE">Electronics and Communication Engineering</option>
          <option value="AI">Artificial Intelligence</option>
        </select>
      </div>

      {isLoading && currentPage === 1 ? (
        !takingtime ? (
          <div className="flex justify-center items-center h-48">
            <span className="loader">Loading files...</span>
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <span className="loader">
              Taking a bit longer time, please hold on...
            </span>
          </div>
        )
      ) : files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {files.map((file, index) => {
            const fileData = {
              file,
              apiUrl,
              user,
              admin1,
              admin2,
              observer: index === files.length - 1 ? observer : null,
              handleDelete,
            };
            return <QPaper key={file._id} data={fileData} />;
          })}
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
