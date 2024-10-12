import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaDownload, FaEye } from "react-icons/fa";

function Home() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          // "${apiUrl}api/uploads"
          `${apiUrl}/api/uploads`
        );
        if (!response.ok) throw new Error("Failed to fetch files");
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        console.log(apiUrl);
        setIsLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchFiles();
  }, [apiUrl]);

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
    <div className="bg-cream min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-light-green">
        IIITK Resource Files
      </h1>

      <div className="flex justify-between mb-4">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
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
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border rounded-lg p-2 bg-white"
        >
          <option value="">All Branches</option>
          <option value="cse">Computer Science Engineering</option>
          <option value="ece">Electronics and Communication Engineering</option>
          <option value="ai">Artificial Intelligence</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <span className="loader">Loading files...</span>{" "}
          {/* Loading indicator */}
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredFiles.map((file) => (
            <div
              key={file._id}
              className="border rounded-lg shadow-lg p-6 bg-white flex flex-col"
            >
              <div className="flex-shrink-0 mb-4">
                {file.filename.endsWith(".pdf") ? (
                  <iframe
                    title="PDF Preview"
                    className="w-full h-48 border"
                    src={`${apiUrl}/api/uploads/${file.filename}`}
                    loading="lazy"
                    style={{ display: "block" }} // Ensure the PDF preview is displayed
                  />
                ) : (
                  <LazyLoadImage
                    alt={file.filename}
                    effect="blur"
                    className="w-full h-48 object-cover cursor-pointer rounded hover:opacity-80 shadow"
                    src={`${apiUrl}/api/uploads/${file.filename}`}
                    onClick={() =>
                      window.open(
                        `${apiUrl}/api/uploads/${file.filename}`,
                        "_blank"
                      )
                    }
                    height={200}
                    width={200}
                    //  onLoad={() => handleFileLoad(file._id)}
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
                  Course Name: {file.metadata.courseName || "Unknown"}
                </p>
                <p className="text-gray-500 text-sm">
                  Uploaded on: {new Date(file.uploadDate).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">
                  File Size: {file.length} bytes
                </p>

                <div className="mt-4 flex space-x-4">
                  <a
                    href={`${apiUrl}/api/uploads/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 underline hover:text-blue-700"
                  >
                    <FaDownload className="mr-1" /> Download
                  </a>
                  <a
                    href={`${apiUrl}/api/uploads/${file.filename}`}
                    onClick={() =>
                      window.open(
                        `${apiUrl}/api/uploads/${file.filename}`,
                        "_blank"
                      )
                    }
                    className="flex items-center text-blue-500 underline hover:text-blue-700 cursor-pointer"
                  >
                    <FaEye className="mr-1" /> View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No files found.</p>
      )}
    </div>
  );
}

export default Home;
