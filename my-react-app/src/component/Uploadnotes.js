import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UploadNotes = () => {
  const { user } = useAuth0();
  const [file, setFile] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("pending");
  const apiurl = process.env.REACT_APP_API_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileLink("");
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }
    user.email === process.env.REACT_APP_ADMIN1 ||
    user.email === process.env.REACT_APP_ADMIN2
      ? setStatus("accepted")
      : setStatus("pending");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiurl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setFileLink(data.secure_url);
      setShowMetaForm(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMetaSubmit = async (e) => {
    e.preventDefault();

    setIsUploading(true);
    const metadata = {
      subjectName,
      year,
      semester,
      branch,
      fileLink,
      status,
    };

    try {
      const response = await fetch(`${apiurl}/api/upload/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (response.ok) {
        alert("Notes uploaded successfully!");
        setSubjectName("");
        setYear("");
        setSemester("");
        setBranch("");
        setFileLink("");
        setShowMetaForm(false);
      } else {
        alert("Error uploading notes!");
      }
    } catch (error) {
      console.error("Error submitting metadata:", error);
      alert("Metadata submission failed!");
    }
    setIsUploading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Notes</h2>

      {!showMetaForm ? (
        <div className="bg-white shadow-lg p-6 rounded-md">
          <input
            type="file"
            name="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block mb-4 w-full border border-gray-300 p-2 rounded-md"
          />
          <button
            onClick={handleFileUpload}
            disabled={isUploading || fileLink}
            className={`w-full ${
              isUploading || fileLink
                ? "bg-green-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-md py-2 font-semibold`}
          >
            {isUploading ? "Uploading..." : fileLink ? "Uploaded" : "Upload"}
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
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Year:
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
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
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 font-semibold"
          >
            Submit Metadata
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadNotes;
