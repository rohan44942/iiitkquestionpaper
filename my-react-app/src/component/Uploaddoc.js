// import { useState } from "react";
// import { User } from "@auth0/auth0-react";

// function Uploaddoc() {
//   const apiurl = process.env.REACT_APP_API_URL;
//   const initialState = null;
//   const [upload, setUpload] = useState(initialState);
//   const [preview, setPreview] = useState(null);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   const [year, setYear] = useState("");
//   const [branch, setBranch] = useState("");
//   const [fileName, setFileName] = useState("");
//   const [description, setDescription] = useState("");
//   const [owner, setOwner] = useState("");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setUpload(file);

//     if (file) {
//       const imagePreviewUrl = URL.createObjectURL(file);
//       setPreview(imagePreviewUrl);
//     } else {
//       setPreview(null);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setOwner(User.email);

//     if (upload) {
//       const formData = new FormData();
//       formData.append("image", upload);
//       formData.append("fileName", fileName);
//       formData.append("description", description);
//       formData.append("year", year);
//       formData.append("branch", branch);
//       formData.append("owner", owner);

      

//       setIsUploading(true);
//       setUploadSuccess(false);

//       async function uploadImage(formData) {
//         try {
//           const response = await fetch(`${apiurl}/api/uploads`, {
//             method: "POST",
//             body: formData,
//           });

//           if (!response.ok) {
//             const errorData = await response.json();
//             console.error("Error response:", errorData);
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }

//           const data = await response.json();
//           console.log("Upload success, received data:", data);

//           setUploadSuccess(true);
//           setIsUploading(false);
//           setUploadedImageUrl(`${apiurl}/api/uploads/${data.file.filename}`);
//         } catch (error) {
//           console.error("Error uploading the file:", error);
//           setIsUploading(false);
//           setUploadSuccess(false);
//         }
//       }

//       uploadImage(formData);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="text-center mb-4 w-full max-w-md"
//       >
//         <input
//           type="file"
//           name="image"
//           onChange={handleImageChange}
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2 mb-4"
//           required
//         />

//         <select
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
//           required
//         >
//           <option value="" disabled>
//             Select Year and Semester
//           </option>
//           <option value="1st sem midterm">1st Sem Mid-Term</option>
//           <option value="1st sem endterm">1st Sem End-Term</option>
          
//         </select>

//         <select
//           value={branch}
//           onChange={(e) => setBranch(e.target.value)}
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
//           required
//         >
//           <option value="" disabled>
//             Select Branch
//           </option>
//           <option value="CSE">Computer Science Engineering</option>
//           <option value="ECE">Electronics and Communication Engineering</option>
//           <option value="AI">Artificial Intelligence</option>
//         </select>

//         <input
//           type="text"
//           value={fileName}
//           onChange={(e) => setFileName(e.target.value)}
//           placeholder="Name of the course e.g. Analog System"
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
//           required
//         />

//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description of the File"
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
//           rows="3"
//         />

//         <button
//           type="submit"
//           className={`bg-blue-600 text-white py-2 px-4 rounded-lg w-full ${
//             isUploading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-700"
//           }`}
//           disabled={isUploading}
//         >
//           {isUploading ? "Uploading..." : "Submit"}
//         </button>
//       </form>

//       {preview && (
//         <div className="mt-4 flex flex-col items-center">
//           <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
//           <img
//             src={preview}
//             alt="Selected"
//             className="w-64 h-64 object-cover border border-gray-300 shadow-lg rounded-lg"
//           />
//         </div>
//       )}

//       {isUploading && (
//         <div className="mt-4 text-blue-500">
//           Uploading image, please wait...
//         </div>
//       )}

//       {uploadSuccess && uploadedImageUrl && (
//         <div className="mt-8 flex flex-col items-center">
//           <h2 className="text-xl font-bold text-green-600 mb-4">
//             Upload Successful!
//           </h2>
//           <img
//             src={uploadedImageUrl}
//             alt="Uploaded file"
//             className="w-64 h-64 object-cover border border-gray-300 shadow-lg rounded-lg"
//           />
//         </div>
//       )}

//       {!uploadSuccess && !isUploading && upload && (
//         <div className="text-red-500 mt-4">
//           Oops! Something went wrong during the upload.
//         </div>
//       )}
//     </div>
//   );
// }

// export default Uploaddoc;
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0 hook

function Uploaddoc() {
  const { user, isAuthenticated } = useAuth0(); // Destructure user from useAuth0
  const apiurl = process.env.REACT_APP_API_URL;
  const initialState = null;
  const [upload, setUpload] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUpload(file);

    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      setPreview(imagePreviewUrl);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user?.email) {
      alert("You need to be logged in to upload files.");
      return;
    }

    if (upload) {
      const formData = new FormData();
      formData.append("image", upload);
      formData.append("fileName", fileName);
      formData.append("description", description);
      formData.append("year", year);
      formData.append("branch", branch);
      formData.append("owner", user.email); // Set owner as user's email

      setIsUploading(true);
      setUploadSuccess(false);

      async function uploadImage(formData) {
        try {
          const response = await fetch(`${apiurl}/api/uploads`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Upload success, received data:", data);

          setUploadSuccess(true);
          setIsUploading(false);
          setUploadedImageUrl(`${apiurl}/api/uploads/${data.file.filename}`);
        } catch (error) {
          console.error("Error uploading the file:", error);
          setIsUploading(false);
          setUploadSuccess(false);
        }
      }

      uploadImage(formData);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="text-center mb-4 w-full max-w-md"
      >
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2 mb-4"
          required
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          required
        >
          <option value="" disabled>
            Select Year and Semester
          </option>
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
          {/* Add other options here */}
        </select>

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          required
        >
          <option value="" disabled>
            Select Branch
          </option>
          <option value="CSE">Computer Science Engineering</option>
          <option value="ECE">Electronics and Communication Engineering</option>
          <option value="AI">Artificial Intelligence</option>
        </select>

        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Name of the course e.g. Analog System"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of the File"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          rows="3"
        />

        <button
          type="submit"
          className={`bg-blue-600 text-white py-2 px-4 rounded-lg w-full ${
            isUploading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-700"
          }`}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Submit"}
        </button>
      </form>

      {preview && (
        <div className="mt-4 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
          <img
            src={preview}
            alt="Selected"
            className="w-64 h-64 object-cover border border-gray-300 shadow-lg rounded-lg"
          />
        </div>
      )}

      {isUploading && (
        <div className="mt-4 text-blue-500">
          Uploading image, please wait...
        </div>
      )}

      {uploadSuccess && uploadedImageUrl && (
        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-green-600 mb-4">
            Upload Successful!
          </h2>
          <img
            src={uploadedImageUrl}
            alt="Uploaded file"
            className="w-64 h-64 object-cover border border-gray-300 shadow-lg rounded-lg"
          />
        </div>
      )}

      {!uploadSuccess && !isUploading && upload && (
        <div className="text-red-500 mt-4">
          Oops! Something went wrong during the upload.
        </div>
      )}
    </div>
  );
}

export default Uploaddoc;
