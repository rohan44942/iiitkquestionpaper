import { useState } from "react";

function Uploaddoc() {
  const apiurl = "http://localhost:5000";
  const initialState = null;
  const [upload, setUpload] = useState(initialState);
  const [preview, setPreview] = useState(null);

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
      formData.append("file", upload);

      // Log the form data to confirm it's correct
      console.log(formData.get("file"));

      // Upload the image using fetch
      async function uploadImage(formData) {
        try {
          const response = await fetch(`${apiurl}/uploads`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("This is the data:", data);
        } catch (error) {
          console.error("Error uploading the file:", error);
        }
      }

      uploadImage(formData);
    }
  };

  return (
    <div className="flex flex-col justify-center text-center align-middle">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
        />
        <button type="submit" className="bg-slate-800 text-white p-1">
          Submit
        </button>
      </form>
      {preview && (
        <div className="mt-4 flex justify-center align-middle">
          <img
            src={preview}
            alt="Selected"
            className="w-64 h-64 object-cover border border-gray-300"
          />
        </div>
      )}
    </div>
  );
}

export default Uploaddoc;
