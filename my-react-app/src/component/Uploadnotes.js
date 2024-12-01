import React, { useReducer, useContext } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../contextapi/userContext";

const initialState = {
  file: null,
  subjectName: "",
  year: "",
  semester: "",
  branch: "",
  fileLink: "",
  showMetaForm: false,
  isUploading: false,
  status: "pending",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FILE":
      return {
        ...state,
        file: action.payload,
        fileLink: "",
        showMetaForm: false,
      };
    case "SET_SUBJECT_NAME":
      return { ...state, subjectName: action.payload };
    case "SET_YEAR":
      return { ...state, year: action.payload };
    case "SET_SEMESTER":
      return { ...state, semester: action.payload };
    case "SET_BRANCH":
      return { ...state, branch: action.payload };
    case "SET_FILE_LINK":
      return { ...state, fileLink: action.payload, showMetaForm: true };
    case "SET_UPLOADING":
      return { ...state, isUploading: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const UploadNotes = () => {
  // const { user } = useAuth0();
  const { user } = useContext(UserContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const apiurl = process.env.REACT_APP_API_URL;

  const handleFileChange = (e) => {
    dispatch({ type: "SET_FILE", payload: e.target.files[0] });
  };

  const handleFileUpload = async () => {
    if (!state.file) {
      alert("Please select a file!");
      return;
    }

    dispatch({ type: "SET_UPLOADING", payload: true });

    const isAdmin =
      user.email === process.env.REACT_APP_ADMIN1 ||
      user.email === process.env.REACT_APP_ADMIN2;
    const status = isAdmin ? "accepted" : "pending";
    dispatch({ type: "SET_UPLOADING", payload: status });

    const formData = new FormData();
    formData.append("file", state.file);

    try {
      const response = await fetch(`${apiurl}/api/upload/link`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      dispatch({ type: "SET_FILE_LINK", payload: data.secure_url });
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.http_code === 400) {
        alert("Got a size Error: ", error.message);
      } else {
        alert("something went wrong");
      }
    } finally {
      dispatch({ type: "SET_UPLOADING", payload: false });
    }
  };

  const handleMetaSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "SET_UPLOADING", payload: true });
    const metadata = {
      subjectName: state.subjectName,
      year: state.year,
      semester: state.semester,
      branch: state.branch,
      fileLink: state.fileLink,
      status: state.status,
    };

    try {
      const response = await fetch(`${apiurl}/api/upload/notes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (response.ok) {
        alert("Notes uploaded successfully!");
        dispatch({ type: "RESET" });
      } else {
        alert("Error uploading notes!");
      }
    } catch (error) {
      console.error("Error submitting metadata:", error);
      alert("Metadata submission failed!");
    }
    dispatch({ type: "SET_UPLOADING", payload: false });
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Notes</h2>

      {!state.showMetaForm ? (
        <div className="bg-white shadow-lg p-6 rounded-md">
          <label>
            <p className="text-green-500 text-center">
              Please upload file size less then 10 mb
            </p>
          </label>
          <input
            type="file"
            name="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block mb-4 w-full border border-gray-300 p-2 rounded-md"
          />
          <button
            onClick={handleFileUpload}
            disabled={state.isUploading || state.fileLink}
            className={`w-full ${
              state.isUploading || state.fileLink
                ? "bg-green-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-md py-2 font-semibold transition duration-300`}
          >
            {state.isUploading
              ? "Uploading..."
              : state.fileLink
              ? "Uploaded"
              : "Upload"}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleMetaSubmit}
          className="bg-white shadow-lg p-6 rounded-md mt-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Subject Name:
            </label>
            <input
              type="text"
              value={state.subjectName}
              onChange={(e) =>
                dispatch({ type: "SET_SUBJECT_NAME", payload: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Year:
            </label>
            <select
              value={state.year}
              onChange={(e) =>
                dispatch({ type: "SET_YEAR", payload: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Semester:
            </label>
            <select
              value={state.semester}
              onChange={(e) =>
                dispatch({ type: "SET_SEMESTER", payload: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            >
              <option value="">Select Semester</option>
              <option value="1st Sem">1st Sem</option>
              <option value="2nd Sem">2nd Sem</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Branch:
            </label>
            <select
              value={state.branch}
              onChange={(e) =>
                dispatch({ type: "SET_BRANCH", payload: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="AI">AI</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 font-semibold transition duration-300"
          >
            Submit Metadata
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadNotes;
