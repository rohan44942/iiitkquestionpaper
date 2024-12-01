import { useReducer, useEffect, useContext } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../contextapi/userContext";

const initialState = {
  upload: null,
  preview: null,
  uploadSuccess: false,
  uploadedImageUrl: null,
  year: "",
  branch: "",
  fileName: "",
  uploadedBy: "",
  description: "",
  status: "pending",
  isUploading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_UPLOAD":
      return { ...state, upload: action.payload };
    case "SET_PREVIEW":
      return { ...state, preview: action.payload };
    case "SET_UPLOAD_SUCCESS":
      return { ...state, uploadSuccess: action.payload };
    case "SET_UPLOADED_IMAGE_URL":
      return { ...state, uploadedImageUrl: action.payload };
    case "SET_YEAR":
      return { ...state, year: action.payload };
    case "SET_BRANCH":
      return { ...state, branch: action.payload };
    case "SET_FILE_NAME":
      return { ...state, fileName: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_IS_UPLOADING":
      return { ...state, isUploading: action.payload };
    case "SET_UPLOADEDBY":
      return { ...state, uploadedBy: action.payload };
    case "CLEAR_FORM_FIELDS":
      return {
        ...state,
        upload: null,
        preview: null,
        year: "",
        branch: "",
        fileName: "",
        description: "",
        uploadedBy: "",
      };
    default:
      return state;
  }
}

function Uploaddoc() {
  const apiurl = process.env.REACT_APP_API_URL;
  // const { user } = useAuth0();
  const { user } = useContext(UserContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    dispatch({ type: "SET_UPLOAD", payload: file });

    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      dispatch({ type: "SET_PREVIEW", payload: imagePreviewUrl });
    } else {
      dispatch({ type: "SET_PREVIEW", payload: null });
    }
  };

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (state.uploadSuccess) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_UPLOAD_SUCCESS", payload: false });
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [state.uploadSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({
      type: "SET_STATUS",
      payload:
        user.email === process.env.REACT_APP_ADMIN1 ||
        user.email === process.env.REACT_APP_ADMIN2
          ? "accepted"
          : "pending",
    });

    if (state.upload) {
      const formData = new FormData();
      formData.append("image", state.upload);
      formData.append("fileName", state.fileName);
      formData.append("description", state.description);
      formData.append("year", state.year);
      formData.append("branch", state.branch);
      formData.append("status", state.status);
      formData.append("uploadedBy", state.uploadedBy);

      dispatch({ type: "SET_IS_UPLOADING", payload: true });

      try {
        const response = await fetch(`${apiurl}/api/uploads`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        dispatch({ type: "SET_UPLOAD_SUCCESS", payload: true });
        dispatch({
          type: "SET_UPLOADED_IMAGE_URL",
          payload: `${apiurl}/api/uploads/${data.file.filename}`,
        });

        dispatch({ type: "CLEAR_FORM_FIELDS" });
      } catch (error) {
        console.error("Error uploading the file:", error);
        dispatch({ type: "SET_UPLOAD_SUCCESS", payload: false });
      } finally {
        dispatch({ type: "SET_IS_UPLOADING", payload: false });
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
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
          value={state.year}
          onChange={(e) =>
            dispatch({ type: "SET_YEAR", payload: e.target.value })
          }
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

        <select
          value={state.branch}
          onChange={(e) =>
            dispatch({ type: "SET_BRANCH", payload: e.target.value })
          }
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
          value={state.fileName}
          onChange={(e) =>
            dispatch({ type: "SET_FILE_NAME", payload: e.target.value })
          }
          placeholder="Name of the File"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          required
        />
        <input
          type="text"
          value={state.uploadedBy}
          onChange={(e) =>
            dispatch({ type: "SET_UPLOADEDBY", payload: e.target.value })
          }
          placeholder="Uploader name by default: A helper"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
        />

        <textarea
          value={state.description}
          onChange={(e) =>
            dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
          }
          placeholder="Description of the File"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 mb-4"
          rows="3"
        />

        <button
          type="submit"
          className={`bg-blue-600 text-white py-2 px-4 rounded-lg ${
            state.isUploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          disabled={state.isUploading}
        >
          {state.isUploading ? "Uploading..." : "Submit"}
        </button>
      </form>

      {state.uploadSuccess && (
        <div className="mt-8 flex justify-center items-center flex-col">
          <h2 className="text-xl font-bold text-green-600 mb-4">
            Upload Successful!
          </h2>
          <p className="text-sm text-gray-600">
            Your file has been uploaded successfully.
          </p>
        </div>
      )}

      {state.preview && (
        <div className="mt-4 flex justify-center items-center flex-col">
          <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
          <img
            src={state.preview}
            alt="Selected"
            className="w-64 h-64 object-cover border border-gray-300 shadow-lg rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

export default Uploaddoc;
