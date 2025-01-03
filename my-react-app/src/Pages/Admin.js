import { useState, useEffect } from "react";
import LogoutButton from "../component/LogoutButton";
import Profile from "../component/Profile";
import MakeAdmin from "../component/MakeAdmin";
import UnexpectedError from "../component/pageErros/UnexpectedError";

const api = process.env.REACT_APP_API_URL;

function Admin() {
  const [pendingExamUploads, setPendingExamUploads] = useState([]);
  const [pendingNotesUploads, setPendingNotesUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingExamUploads = async () => {
      try {
        const res = await fetch(`${api}/api/uploads/status/pending/papers`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(
            "Unauthorized access or session expired. Please log in again."
          );
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setPendingExamUploads(data);
        } else {
          setError("Failed to load pending exam uploads.");
        }
      } catch (error) {
        console.error("Error fetching pending exam uploads:", error);
        setError(error.message);
      }
    };

    const fetchPendingNotesUploads = async () => {
      try {
        const res = await fetch(`${api}/api/uploads/status/pending/notes`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(
            "Unauthorized access or session expired. Please log in again."
          );
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setPendingNotesUploads(data);
        } else {
          setError("Failed to load pending notes uploads.");
        }
      } catch (error) {
        console.error("Error fetching pending notes uploads:", error);
        setError(error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPendingExamUploads(),
        fetchPendingNotesUploads(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const declineUpload = async (id, type) => {
    try {
      await fetch(`${api}/api/uploads/${type}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (type === "exam") {
        setPendingExamUploads(
          pendingExamUploads.filter((upload) => upload._id !== id)
        );
      } else {
        setPendingNotesUploads(
          pendingNotesUploads.filter((upload) => upload._id !== id)
        );
      }
    } catch (error) {
      console.error("Error declining upload:", error);
      setError("Failed to decline upload.");
    }
  };

  const acceptUpload = async (id, type) => {
    try {
      await fetch(`${api}/api/uploads/status/accept/${type}/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (type === "exam") {
        setPendingExamUploads(
          pendingExamUploads.filter((upload) => upload._id !== id)
        );
      } else {
        setPendingNotesUploads(
          pendingNotesUploads.filter((upload) => upload._id !== id)
        );
      }
    } catch (error) {
      console.error("Error accepting upload:", error);
      setError("Failed to accept upload.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600 pt-20 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <Profile />
        <LogoutButton />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <UnexpectedError>{error}</UnexpectedError>
      ) : (
        <div className="flex flex-col h-full">
          <div className="w-full h-full lg:h-auto flex-shrink-0">
            <MakeAdmin />
          </div>

          <div className="w-full flex-grow p-6">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              Pending Exam Uploads
            </h2>
            {pendingExamUploads.length === 0 ? (
              <p className="text-gray-500">No pending uploads.</p>
            ) : (
              <ul className="space-y-6">
                {pendingExamUploads.map((upload) => (
                  <li
                    key={upload._id}
                    className="bg-white rounded-lg shadow-lg p-6 space-y-1"
                  >
                    <h3 className="text-xl font-bold">
                      {upload.metadata.fileName}
                    </h3>
                    <p className="text-gray-600">
                      Year and Semester: {upload.metadata.year}
                    </p>
                    <p className="text-gray-600">
                      Branch: {upload.metadata.branch}
                    </p>
                    <p className="text-gray-600">
                      Description: {upload.metadata.description}
                    </p>
                    <p className="text-gray-600">Date: {upload.uploadDate}</p>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={() => acceptUpload(upload._id, "exam")}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineUpload(upload._id, "exam")}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        Decline
                      </button>
                    </div>
                    <div className="mt-4">
                      <a
                        href={`${api}/api/uploads/${upload.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition duration-300"
                      >
                        Preview Exam Paper
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Pending Notes Uploads */}
            <h2 className="text-3xl font-semibold text-gray-700 mb-4 mt-6">
              Pending Notes Uploads
            </h2>
            {pendingNotesUploads.length === 0 ? (
              <p className="text-gray-500">No pending uploads.</p>
            ) : (
              <ul className="space-y-2">
                {pendingNotesUploads.map((upload) => (
                  <li
                    key={upload._id}
                    className="bg-white rounded-lg shadow-lg p-6 space-y-1"
                  >
                    <h3 className="text-xl font-bold">{upload.subjectName}</h3>
                    <p className="text-gray-600">
                      Year and semester: {upload.year}
                    </p>
                    <p className="text-gray-600">Branch: {upload.branch}</p>
                    <p className="text-gray-600">
                      Description: {upload.description}
                    </p>
                    <div className="space-x-4">
                      <button
                        onClick={() => acceptUpload(upload._id, "notes")}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineUpload(upload._id, "notes")}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                      >
                        Decline
                      </button>
                    </div>
                    <div className="mt-4">
                      <a
                        href={upload.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Preview Notes
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
