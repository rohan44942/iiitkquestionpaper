import { useState } from "react";

function Uploaddoc() {
  const apiurl = "http://localhost:5000"
  const initialState = null;
  const [upload, setUpload] = useState(initialState);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    // console.log("this is the file ", e.target.files[0]);
    const file = e.target.files[0];
    setUpload(file);
    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      setPreview(imagePreviewUrl);
    }
  };

  
const handleSubmit = (e) => {
    e.preventDefault();
    
    if (upload) {
      const formData = new FormData();
      formData.append("image", upload);
      console.log(formData.get("image"));

        fetch(`${apiurl}/api/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json()) 
        .then((data) => {
          console.log(data); 
        })
        .catch((error) => {
          console.error("Error:", error); 
        });
    } else {
      console.log("Please upload an image");
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center text-center align-middle ">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleImageChange(e);
            }}
          ></input>
          <button type="submit" className="bg-slate-800 text-white p-1 ">
            Submit
          </button>
        </form>
        {preview && (
          <div className="mt-4 flex justify-center align-middle ">
            <img
              src={preview}
              alt="Selected"
              className="w-64 h-64 object-cover border border-gray-300"
            />
          </div>
        )}
      </div>
      {/* <div></div> */}
    </>
  );
}

export default Uploaddoc;
