import React, { useState } from "react";

const UploadNotes = () => {
  const [file, setFile] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [showMetaForm, setShowMetaForm] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        // API route for file upload to Cloudinary
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setFileLink(data.secure_url);
      setShowMetaForm(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed!");
    }
  };

  const handleMetaSubmit = async (e) => {
    e.preventDefault();

    const metadata = {
      subjectName,
      year,
      semester,
      branch,
      fileLink,
    };

    try {
      const response = await fetch("http://localhost:5000/api/upload/notes", {
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
  };

  return (
    <div>
      <h2>Upload Notes</h2>
      {!showMetaForm ? (
        <div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button onClick={handleFileUpload}>Upload File</button>
        </div>
      ) : (
        <form onSubmit={handleMetaSubmit}>
          <div>
            <label>
              Subject Name:
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Year:
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Semester:
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option value="">Select Semester</option>
                <option value="1st Sem">1st Sem</option>
                <option value="2nd Sem">2nd Sem</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Branch:
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              >
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="AI">AI</option>
              </select>
            </label>
          </div>
          <button type="submit">Submit Metadata</button>
        </form>
      )}
    </div>
  );
};

export default UploadNotes;
