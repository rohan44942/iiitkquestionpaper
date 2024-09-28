import React, { useEffect, useState } from 'react';

function Home() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Fetching the metadata of all uploaded files
        const response = await fetch('http://localhost:5000/api/uploads');
        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        setFiles(data); // Update state with file metadata
      } catch (err) {
        setError(err.message); // Capture any errors
      }
    };

    fetchFiles();
  }, []);

  if (error) {
    return <div>Error: {error}</div>; // Display error if any
  }

  return (
    <div>
      <h1>Uploaded Files</h1>
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              {/* Link to download/view the file */}
              <a href={`http://localhost:5000/api/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">
                {file.filename}
              </a>
              {/* Optionally display other metadata */}
              <p>Upload Date: {new Date(file.uploadDate).toLocaleString()}</p>
              <p>File Size: {file.length} bytes</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files found.</p>
      )}
    </div>
  );
}

export default Home;
