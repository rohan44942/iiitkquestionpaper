import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaDownload, FaEye, FaTrash } from "react-icons/fa";
import { useEffect } from "react";

function Home(
  isLoading,
  currentPage,
  takingtime,
  user,
  observer,
  setFiles,
  yearFilter,
  branchFilter
) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const admin1 = process.env.REACT_APP_ADMIN1;
  const admin2 = process.env.REACT_APP_ADMIN2;
  // if wait is longer the ususal
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

  const fetchFiles = async (page) => {
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
  };

  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage, yearFilter, branchFilter]);

  const filteredFiles = files.filter((file) => {
    return (
      (yearFilter ? file.metadata.year === yearFilter : true) &&
      (branchFilter ? file.metadata.branch === branchFilter : true)
    );
  });
  return (
    <div>
      {isLoading && currentPage === 1 ? (
        !takingtime ? (
          <div className="flex justify-center items-center h-48">
            <span className="loader">Loading files...</span>
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <span className="loader">Taking long time please hold on...</span>
            {/* // time is taking much then it show message hold on more can
           also show some youtube animation type things on the page  */}
          </div>
        )
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
    </div>
  );
}

export default Home;
