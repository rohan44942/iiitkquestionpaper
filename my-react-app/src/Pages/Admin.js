import { useState, useEffect } from "react";
import LogoutButton from "../component/LogoutButton";
import Profile from "../component/Profile";

const api = process.env.REACT_APP_API_URL;

function Admin() {
  const [pendingUploads, setPendingUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending uploads from MongoDB
  useEffect(() => {
    fetchPendingUploads();
  }, []);

  const fetchPendingUploads = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(`${api}/api/uploads/status/pending`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      console.log(data);
      
      setPendingUploads(data); // Store pending uploads in state
    } catch (error) {
      console.error("Error fetching pending uploads:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to decline and delete a pending upload
  const declineUpload = async (id) => {
    try {
      const res = await fetch(`${api}/api/uploads/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to decline upload");
      }
      fetchPendingUploads(); // Re-fetch pending uploads after action
    } catch (error) {
      console.error("Error declining upload:", error);
    }
  };

  // Function to accept the pending upload
  const acceptUpload = async (id) => {
    try {
      const res = await fetch(`${api}/api/uploads/status/accept/${id}`, {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error("Failed to accept upload");
      }
      fetchPendingUploads(); // Re-fetch pending uploads after action
    } catch (error) {
      console.error("Error accepting upload:", error);
    }
  };

  // Confirm action before Accept/Decline
  const confirmAction = (action, id) => {
    if (window.confirm(`Are you sure you want to ${action} this upload?`)) {
      action === "accept" ? acceptUpload(id) : declineUpload(id);
    }
  };

  // Helper function to render file previews (images and PDFs)
  const renderPreview = (upload) => {
    const fileType = upload.contentType;

    if (fileType.startsWith("image/")) {
      // Image file
      return (
        <img
          src={`${api}/api/uploads/${upload._id}`} // Adjust the endpoint to serve the image file
          alt={upload.fileName}
          className="w-24 h-24 object-cover rounded-lg shadow-md"
          onError={(e) => (e.target.src = "/path/to/default_image.png")} // Fallback image
        />
      );
    } else if (fileType === "application/pdf") {
      // PDF file
      return (
        <iframe
          src={`${api}/api/uploads/${upload._id}`} // Adjust the endpoint to serve the PDF file
          title={upload.fileName}
          className="w-full h-48"
          onError={(e) => (e.target.src = "/path/to/fallback.pdf")} // Fallback PDF
        ></iframe>
      );
    }
    return <p className="text-gray-500">No preview available</p>;
  };

  return (
    <div className="bg-gray-50 pt-20 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Flex between Profile and LogoutButton */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <Profile />
        <LogoutButton />
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Uploads</h2>
      
      {/* Show loading state or pending uploads */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : pendingUploads.length === 0 ? (
        <p className="text-gray-500">No pending uploads.</p>
      ) : (
        <ul className="space-y-6">
          {pendingUploads.map((upload) => (
            <li
              key={upload._id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6"
            >
              {/* File details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{upload.fileName}</h3>
                <p className="text-gray-600">
                  <strong>Status:</strong> {upload.metadata.status}
                </p>
                <p className="text-gray-600">
                  <strong>Upload Date:</strong> {new Date(upload.uploadDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Size:</strong> {(upload.length / 1024).toFixed(2)} KB
                </p>
                <p className="text-gray-600">
                  <strong>Content Type:</strong> {upload.contentType}
                </p>

                {/* Preview of file */}
                <div className="mt-4">
                  <strong>Preview:</strong>
                  <div className="mt-2">{renderPreview(upload)}</div>
                </div>
              </div>

              {/* Accept and Decline buttons */}
              <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4">
                <button
                  onClick={() => confirmAction("accept", upload._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300"
                >
                  Accept
                </button>
                <button
                  onClick={() => confirmAction("decline", upload._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
