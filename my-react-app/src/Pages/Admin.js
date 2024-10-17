// import { useState, useEffect } from "react";
// import LogoutButton from "../component/LogoutButton";
// import Profile from "../component/Profile";

// const api = process.env.REACT_APP_API_URL;

// function Admin() {
//   const [pendingExamUploads, setpendingExamUploads] = useState([]);
//   const [pendingNotesUploads, setpengingNotesUplaods] = useState([]);

//   // Fetch pending uploads from MongoDB
//   useEffect(() => {
//     const fetchPendingExamUploads = async () => {
//       try {
//         const res = await fetch(`${api}/api/uploads/status/pending/papers`);
//         const data = await res.json();
//         setpendingExamUploads(data); // Store pending uploads in state
//       } catch (error) {
//         console.error("Error fetching pending uploads:", error);
//       }
//     };
//     const fetchPendingNotesUploads = async () => {
//       try {
//         const res = await fetch(`${api}/api/uploads/status/pending/notes`);
//         const data = await res.json();
//         setpengingNotesUplaods(data); // Store pending uploads in state
//       } catch (error) {
//         console.error("Error fetching notes pending uploads:", error);
//       }
//     };

//     fetchPendingExamUploads();
//     fetchPendingNotesUploads();
//   }, []);

//   // Function to decline and delete a pending upload
//   const declineUpload = async (id) => {
//     try {
//       await fetch(`${api}/api/uploads/${id}`, {
//         method: "DELETE",
//       });
//       // Remove the declined upload from the state
//       setpendingExamUploads(
//         pendingExamUploads.filter((upload) => upload._id !== id)
//       );
//     } catch (error) {
//       console.error("Error declining upload:", error);
//     }
//   };

//   // Function to accept the pending upload
//   const acceptUpload = async (id) => {
//     try {
//       await fetch(`${api}/api/uploads/status/accept/${id}`, {
//         method: "PUT",
//       });
//       // Remove the accepted upload from the state after status change
//       setpendingExamUploads(
//         pendingExamUploads.filter((upload) => upload._id !== id)
//       );
//     } catch (error) {
//       console.error("Error accepting upload:", error);
//     }
//   };

//   // Helper function to render file previews (images and PDFs)
//   const renderPreview = (upload) => {
//     const fileType = upload.contentType;

//     if (fileType.startsWith("image/")) {
//       // Image file
//       return (
//         <img
//           src={`${api}/api/uploads/${upload._id}`} // Adjust the endpoint to serve the image file
//           alt={upload.fileName}
//           className="w-24 h-24 object-cover rounded-lg shadow-md"
//         />
//       );
//     } else if (fileType === "application/pdf") {
//       // PDF file
//       return (
//         <iframe
//           src={`${api}/api/uploads/${upload._id}`} // Adjust the endpoint to serve the PDF file
//           title={upload.fileName}
//           className="w-full h-48"
//         ></iframe>
//       );
//     }
//     return <p className="text-gray-500">No preview available</p>;
//   };

//   return (
//     <div className="bg-gray-50 pt-20 min-h-screen p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

//       {/* Flex between Profile and LogoutButton */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
//         <Profile />
//         <LogoutButton />
//       </div>

//       <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//         Pending Exam Uploads
//       </h2>
//       {pendingExamUploads.length === 0 ? (
//         <p className="text-gray-500">No pending uploads.</p>
//       ) : (
//         <ul className="space-y-6">
//           {pendingExamUploads.map((upload) => (
//             <li
//               key={upload._id}
//               className="bg-white rounded-lg shadow-lg p-6 flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6"
//             >
//               {/* File details */}
//               <div className="flex-1">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   {upload.fileName}
//                 </h3>
//                 <p className="text-gray-600">
//                   <strong>Status:</strong> {upload.metadata.status}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Upload Date:</strong>{" "}
//                   {new Date(upload.uploadDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Size:</strong> {(upload.length / 1024).toFixed(2)} KB
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Content Type:</strong> {upload.contentType}
//                 </p>

//                 {/* Preview of file */}
//                 <div className="mt-4">
//                   <strong>Preview:</strong>
//                   <div className="mt-2">{renderPreview(upload)}</div>
//                 </div>
//               </div>

//               {/* Accept and Decline buttons */}
//               <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4">
//                 <button
//                   onClick={() => acceptUpload(upload._id)}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => declineUpload(upload._id)}
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
//                 >
//                   Decline
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//       <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//         Pending Notes Uploads
//       </h2>
//       {pendingNotesUploads.length === 0 ? (
//         <p className="text-gray-500">No pending uploads.</p>
//       ) : (
//         <ul className="space-y-6">
//           {pendingNotesUploads.map((upload) => (
//             <li
//               key={upload._id}
//               className="bg-white rounded-lg shadow-lg p-6 flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6"
//             >
//               {/* File details */}
//               <div className="flex-1">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   {upload.subjectName}
//                 </h3>
//                 <p className="text-gray-600">
//                   <strong>Status:</strong> {upload.status}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Upload Date:</strong>{" "}
//                   {new Date(upload.uploadDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>year:</strong> {upload.year}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Preview:</strong> {upload.fileLink}
//                 </p>
//               </div>

//               {/* Accept and Decline buttons */}
//               <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4">
//                 <button
//                   onClick={() => acceptUpload(upload._id)}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => declineUpload(upload._id)}
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
//                 >
//                   Decline
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default Admin;
import { useState, useEffect } from "react";
import LogoutButton from "../component/LogoutButton";
import Profile from "../component/Profile";

const api = process.env.REACT_APP_API_URL;

function Admin() {
  const [pendingExamUploads, setpendingExamUploads] = useState([]);
  const [pendingNotesUploads, setpendingNotesUploads] = useState([]);

  // Fetch pending uploads from MongoDB
  useEffect(() => {
    const fetchPendingExamUploads = async () => {
      try {
        const res = await fetch(`${api}/api/uploads/status/pending/papers`);
        const data = await res.json();
        setpendingExamUploads(data);
      } catch (error) {
        console.error("Error fetching pending uploads:", error);
      }
    };
    const fetchPendingNotesUploads = async () => {
      try {
        const res = await fetch(`${api}/api/uploads/status/pending/notes`);
        const data = await res.json();
        setpendingNotesUploads(data); // Fix typo here
      } catch (error) {
        console.error("Error fetching notes pending uploads:", error);
      }
    };

    fetchPendingExamUploads();
    fetchPendingNotesUploads();
  }, []);

  const declineUpload = async (id, type) => {
    try {
      await fetch(`${api}/api/uploads/${type}/${id}`, { method: "DELETE" });
      if (type === "exam") {
        setpendingExamUploads(
          pendingExamUploads.filter((upload) => upload._id !== id)
        );
      } else {
        setpendingNotesUploads(
          pendingNotesUploads.filter((upload) => upload._id !== id)
        );
      }
    } catch (error) {
      console.error("Error declining upload:", error);
    }
  };
  
  const acceptUpload = async (id, type) => {
    try {
      await fetch(`${api}/api/uploads/status/accept/${type}/${id}`, { method: "PUT" });
      if (type === "exam") {
        setpendingExamUploads(
          pendingExamUploads.filter((upload) => upload._id !== id)
        );
      } else {
        setpendingNotesUploads(
          pendingNotesUploads.filter((upload) => upload._id !== id)
        );
      }
    } catch (error) {
      console.error("Error accepting upload:", error);
    }
  };
  

  return (
    <div className="bg-gray-50 pt-20 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <Profile />
        <LogoutButton />
      </div>

      {/* Pending Exam Uploads */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Pending Exam Uploads
      </h2>
      {pendingExamUploads.length === 0 ? (
        <p className="text-gray-500">No pending uploads.</p>
      ) : (
        <ul className="space-y-6">
          {pendingExamUploads.map((upload) => (
            <li key={upload._id} className="bg-white rounded-lg shadow-lg p-6">
              <h3>{upload.fileName}</h3>
              <p>Status: {upload.metadata.status}</p>
              <button onClick={() => acceptUpload(upload._id, "exam")}>
                Accept
              </button>
              <button onClick={() => declineUpload(upload._id, "exam")}>
                Decline
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Pending Notes Uploads */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Pending Notes Uploads
      </h2>
      {pendingNotesUploads.length === 0 ? (
        <p className="text-gray-500">No pending uploads.</p>
      ) : (
        <ul className="space-y-6">
          {pendingNotesUploads.map((upload) => (
            <li key={upload._id} className="bg-white rounded-lg shadow-lg p-6">
              <h3>{upload.subjectName}</h3>
              <p>Status: {upload.status}</p>
              <p>
                Preview: <a href={upload.fileLink}>{upload.fileLink}</a>
              </p>
              <button onClick={() => acceptUpload(upload._id, "notes")}>
                Accept
              </button>
              <button onClick={() => declineUpload(upload._id, "notes")}>
                Decline
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default Admin;
