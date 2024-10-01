// import { useState } from "react";

// function Uploaddoc() {
//   const apiurl = "http://localhost:5000";
//   const initialState = null;
//   const [upload, setUpload] = useState(initialState);
//   const [preview, setPreview] = useState(null);
//   const [uploadSuccess, setUploadSuccess] = useState(false); // Track upload success
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // To store uploaded file's URL

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

//     if (upload) {
//       const formData = new FormData();
//       formData.append("image", upload);

//       // Log the form data to confirm it's correct
//       console.log(formData.get("image"));

//       // Upload the image using fetch
//       async function uploadImage(formData) {
//         try {
//           const response = await fetch(`${apiurl}/api/uploads`, {
//             method: "POST",
//             body: formData,
//           });

//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }

//           const data = await response.json();
//           console.log("This is the data:", data);

//           // If upload is successful
//           setUploadSuccess(true);
//           // Assuming the response contains the uploaded file's URL, save it to state
//           setUploadedImageUrl(`${apiurl}/api/uploads/${data.filename}`); // Adjust according to your server response
//         } catch (error) {
//           console.error("Error uploading the file:", error);
//           setUploadSuccess(false);
//         }
//       }

//       uploadImage(formData);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center p-6">
//       <form onSubmit={handleSubmit} className="text-center mb-4">
//         <input
//           type="file"
//           name="image"
//           onChange={handleImageChange}
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2 mb-4"
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
//         >
//           Submit
//         </button>
//       </form>

//       {preview && (
//         <div className="mt-4 flex justify-center items-center flex-col">
//           <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
//           <img
//             src={preview}
//             alt="Selected"
//             className="w-64 h-64 object-cover border border-gray-300 shadow-lg rounded-lg"
//           />
//         </div>
//       )}

//       {/* Show success message and uploaded image */}
//       {uploadSuccess && uploadedImageUrl && (
//         <div className="mt-8 flex justify-center items-center flex-col">
//           <h2 className="text-xl font-bold text-green-600 mb-4">
//             Upload Successful!
//           </h2>
//           <div className="relative">
//             <img
//               src={uploadedImageUrl}
//               alt="Uploaded File"
//               className="w-64 h-64 object-cover border border-gray-300 shadow-xl rounded-lg"
//             />
//             <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 rounded-b-lg">
//               Uploaded Image
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error handling: Show this message if something goes wrong */}
//       {!uploadSuccess && upload && (
//         <div className="text-red-500 mt-4">
//           Oops! Something went wrong during the upload.
//         </div>
//       )}
//     </div>
//   );
// }

// export default Uploaddoc;

import { useState } from "react";

function Uploaddoc() {
  const apiurl = "https://iiitkresources.onrender.com";
  const initialState = null;
  const [upload, setUpload] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // Track upload success
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // To store uploaded file's URL

  // New state variables for metadata inputs
  const [year, setYear] = useState(""); // Year input
  const [branch, setBranch] = useState(""); // Branch input
  const [fileName, setFileName] = useState(""); // Name of the file
  const [description, setDescription] = useState(""); // Description of the file

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

    if (upload) {
      const formData = new FormData();
      formData.append("image", upload); // Image file
      formData.append("fileName", fileName); // File name
      formData.append("description", description); // Description
      formData.append("year", year); // Year
      formData.append("branch", branch); // Branch

      // Log the form data entries to confirm they are appended correctly
      console.log("FormData:", Array.from(formData.entries()));

      // Upload the image using fetch
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

          // Assuming your backend responds with the file info (including filename)
          setUploadSuccess(true);
          setUploadedImageUrl(`${apiurl}/api/uploads/${data.file.filename}`); // Adjust to your backend response
        } catch (error) {
          console.error("Error uploading the file:", error);
          setUploadSuccess(false);
        }
      }

      uploadImage(formData);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <form onSubmit={handleSubmit} className="text-center mb-4">
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2 mb-4"
          required
        />

        {/* Input for Year */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          required
        >
          <option value="" disabled>
            Select Year
          </option>
          <option value="first">First Year</option>
          <option value="second">Second Year</option>
          <option value="third">Third Year</option>
          <option value="fourth">Fourth Year</option>
        </select>

        {/* Input for Branch */}
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          required
        >
          <option value="" disabled>
            Select Branch
          </option>
          <option value="cse">Computer Science Engineering</option>
          <option value="ece">Electronics and Communication Engineering</option>
          <option value="ai">Artificial Intelligence</option>
        </select>

        {/* Input for Name of File */}
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Name of the File"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          required
        />

        {/* Input for Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of the File"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          rows="3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {preview && (
        <div className="mt-4 flex justify-center items-center flex-col">
          <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
          <img
            src={preview}
            alt="Selected"
            className="w-64 h-64 object-cover border border-gray-300 shadow-lg rounded-lg"
          />
        </div>
      )}

      {/* Show success message and uploaded image */}
      {uploadSuccess && uploadedImageUrl && (
        <div className="mt-8 flex justify-center items-center flex-col">
          <h2 className="text-xl font-bold text-green-600 mb-4">
            Upload Successful!
          </h2>
          <div className="relative">
            <img
              src={uploadedImageUrl}
              alt="Uploaded File"
              className="w-64 h-64 object-cover border border-gray-300 shadow-xl rounded-lg"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 rounded-b-lg">
              Uploaded Image
            </div>
          </div>
        </div>
      )}

      {/* Error handling: Show this message if something goes wrong */}
      {!uploadSuccess && upload && (
        <div className="text-red-500 mt-4">
          Oops! Something went wrong during the upload.
        </div>
      )}
    </div>
  );
}

export default Uploaddoc;
