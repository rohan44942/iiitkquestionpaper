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
          style={{ width: "100px", height: "100px" }}
        />
      );
    } else if (fileType === "application/pdf") {
      // PDF file
      return (
        <iframe
          src={`${api}/api/uploads/${upload._id}`} // Adjust the endpoint to serve the PDF file
          title={upload.fileName}
          width="100%"
          height="200px"
        ></iframe>
      );
    }
    return <p>No preview available</p>;
  };

  return (
    <div>
      <h1>This is the Admin page</h1>
      <Profile />
      <LogoutButton />

      <h2>Pending Uploads</h2>
      {pendingUploads.length === 0 ? (
        <p>No pending uploads.</p>
      ) : (
        <ul>
          {pendingUploads.map((upload) => (
            <li key={upload._id}>
              <h3>{upload.fileName}</h3>
              <p><strong>Status:</strong> {upload.metadata.status}</p>
              <p><strong>Upload Date:</strong> {new Date(upload.uploadDate).toLocaleDateString()}</p>
              <p><strong>Size:</strong> {(upload.length / 1024).toFixed(2)} KB</p>
              <p><strong>Content Type:</strong> {upload.contentType}</p>

              <div>
                <strong>Preview:</strong>
                {renderPreview(upload)} {/* Preview for images or PDFs */}
              </div>

              <button onClick={() => acceptUpload(upload._id)}>Accept</button>
              <button onClick={() => declineUpload(upload._id)}>Decline</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
