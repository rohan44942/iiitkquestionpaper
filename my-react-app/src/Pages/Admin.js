import { useState, useEffect } from "react";
import LogoutButton from "../component/LogoutButton";
import Profile from "../component/Profile";

const api = process.env.REACT_APP_API_URL;

function Admin() {
  const [pendingUploads, setPendingUploads] = useState([]);

  // Fetch pending uploads from MongoDB
  useEffect(() => {
    const fetchPendingUploads = async () => {
      try {
        const res = await fetch(`${api}/api/uploads/status/pending`);
        const data = await res.json();
        setPendingUploads(data); // Store pending uploads in state
      } catch (error) {
        console.error("Error fetching pending uploads:", error);
      }
    };

    fetchPendingUploads();
  }, []);

  // Function to decline and delete a pending upload
  const declineUpload = async (id) => {
    try {
      await fetch(`${api}/api/uploads/${id}`, {
        method: "DELETE",
      });
      // Remove the declined upload from the state
      setPendingUploads(pendingUploads.filter((upload) => upload._id !== id));
    } catch (error) {
      console.error("Error declining upload:", error);
    }
  };

  // Function to accept the pending upload
  const acceptUpload = async (id) => {
    try {
      await fetch(`${api}/api/uploads/status/accept/${id}`, {
        method: "PUT",
      });
      // Remove the accepted upload from the state after status change
      setPendingUploads(pendingUploads.filter((upload) => upload._id !== id));
    } catch (error) {
      console.error("Error accepting upload:", error);
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
        />
      );
    } else if (fileType === "application/pdf") {
      // PDF file
      return (
        <iframe
          src={`${api}/api/uploads/${upload._id}`} // Adjust the endpoint to serve the PDF file
          title={upload.fileName}
          className="w-full h-48"
        ></iframe>
      );
    }
    return <p className="text-gray-500">No preview available</p>;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="flex justify-between items-center mb-4">
        <Profile />
        <LogoutButton />
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Uploads</h2>
      {pendingUploads.length === 0 ? (
        <p className="text-gray-500">No pending uploads.</p>
      ) : (
        <ul className="space-y-6">
          {pendingUploads.map((upload) => (
            <li key={upload._id} className="bg-white rounded-lg shadow-lg p-6">
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

              <div className="mt-4">
                <strong>Preview:</strong>
                <div className="mt-2">{renderPreview(upload)}</div>
              </div>

              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => acceptUpload(upload._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineUpload(upload._id)}
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
