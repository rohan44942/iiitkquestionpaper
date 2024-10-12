import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
function Uploaddoc() {
  const apiurl = "http://localhost:5000";
  const initialState = null;
  const { user } = useAuth0();
  const [upload, setUpload] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // Track upload success
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // To store uploaded file's URL

  // New state variables for metadata inputs
  const [year, setYear] = useState(""); // Year input
  const [branch, setBranch] = useState(""); // Branch input
  const [fileName, setFileName] = useState(""); // Name of the file
  const [description, setDescription] = useState(""); // Description of the file
  const [status, setStatus] = useState("pending");

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
    user.email === process.env.REACT_APP_ADMIN1 ||
    user.email === process.env.REACT_APP_ADMIN2
      ? setStatus("accepted")
      : setStatus("pending");
    if (upload) {
      const formData = new FormData();
      formData.append("image", upload); // Image file
      formData.append("fileName", fileName); // File name
      formData.append("description", description); // Description
      formData.append("year", year); // Year
      formData.append("branch", branch); // Branch
      formData.append("status", status);

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
            Select Sem and Year
          </option>
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
      {uploadSuccess && uploadedImageUrl && (
        <div className="mt-8 flex justify-center items-center flex-col">
          <h2 className="text-xl font-bold text-green-600 mb-4">
            Upload Successful!
          </h2>
        </div>
      )}
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

      {/* Error handling: Show this message if something goes wrong */}
      {!uploadSuccess && upload && (
        <div className="text-red-100 mt-4">
          Oops! Something went wrong during the upload.
        </div>
      )}
    </div>
  );
}

export default Uploaddoc;
