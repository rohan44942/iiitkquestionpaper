import { useState } from "react";

function Uploaddoc() {
  const apiurl = "http://localhost:5000";
  const initialState = null;
  const [upload, setUpload] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // Track upload success
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // To store uploaded file's URL

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
      formData.append("image", upload);

      // Log the form data to confirm it's correct
      console.log(formData.get("image"));

      // Upload the image using fetch
      async function uploadImage(formData) {
        try {
          const response = await fetch(`${apiurl}/api/uploads`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("This is the data:", data);

          // If upload is successful
          setUploadSuccess(true);
          // Assuming the response contains the uploaded file's URL, save it to state
          setUploadedImageUrl(`${apiurl}/api/uploads/${data.filename}`); // Adjust according to your server response
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
