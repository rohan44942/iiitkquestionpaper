import React, { useEffect, useState, useCallback, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaDownload, FaEye } from "react-icons/fa";

function Home() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Changed initial state to false
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(); // Use ref to hold the observer
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchFiles = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/uploads/?page=${page}&limit=10&year=${yearFilter}&branch=${branchFilter}`
      );
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();

      setFiles((prev) => [...prev, ...data.files]); // Append new files
      setHasMore(data.files.length > 0); // Set hasMore based on the response
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Set loading to false after fetching is done
    }
  };

  // Infinite Scroll using Intersection Observer
  const observer = useCallback(
    (node) => {
      if (isLoading || !hasMore) return; // Exit if still loading or no more data
      if (observerRef.current) observerRef.current.disconnect(); // Disconnect previous observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1); // Increase the page
          }
        },
        {
          root: null,
          rootMargin: "20px",
          threshold: 1.0,
        }
      );
      if (node) observerRef.current.observe(node); // Observe new node
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchFiles(currentPage); // Fetch files whenever currentPage changes
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

      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2 ">
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setCurrentPage(1); // Reset to first page on filter change
            setFiles([]); // Clear current files
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
            setCurrentPage(1); // Reset to first page on filter change
            setFiles([]); // Clear current files
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {filteredFiles.reverse().map((file, index) => (
            <div
              key={file._id}
              ref={index === filteredFiles.length - 1 ? observer : null} // Observe last item for infinite scroll
              className="border rounded-lg shadow-lg p-6 bg-gray-50 flex flex-col"
            >
              <div className="flex-shrink-0 mb-4">
                {file.filename.endsWith(".pdf") ? (
                  <iframe
                    title="PDF Preview"
                    style={{ display: "block" }}
                    className="w-full h-48 border-none overflow-hidden "
                    src={`${apiUrl}/api/uploads/${file.filename}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="relative inline-block">
                    <LazyLoadImage
                      alt={file.filename}
                      effect="blur"
                      className="w-full h-48 object-cover cursor-pointer rounded hover:opacity-80 shadow"
                      src={`${apiUrl}/api/uploads/${file.filename}`}
                      height={200}
                      width={200}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded">
                      <span className="text-white text-sm">
                        Click on the view to preview
                      </span>
                    </div>
                  </div>
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
                  uploaded by: {file.metadata.uploadedBy || "A Helper"}
                </p>
                <p className="text-gray-500 text-sm">
                  Uploaded on:{" "}
                  {new Date(file.uploadDate).toLocaleDateString("en-CA")}
                </p>
                <p className="text-gray-500 text-sm">
                  File Size: {(file.length / 1000).toFixed(2)} Kb
                </p>

                <div className="mt-4 flex space-x-4">
                  <a
                    href={`${apiUrl}/api/download/${file.filename}`} // Changed to use the download route
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <FaDownload className="mr-1" /> Download
                  </a>

                  <a
                    href={`${apiUrl}/api/uploads/${file.filename}`} // Changed to use the preview route
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <FaEye className="mr-1" /> View
                  </a>
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
