import React, { useEffect, useState } from "react";

function ShowNotes() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/upload/notes");
        const data = await response.json();
        setNotes(data);
        setFilteredNotes(data); // Initialize filtered notes with fetched data
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []); // Empty dependency array means it runs once when component mounts

  // Filter notes based on selected criteria
  useEffect(() => {
    let filtered = notes;

    if (yearFilter) {
      filtered = filtered.filter(note => note.year === yearFilter);
    }

    if (semesterFilter) {
      filtered = filtered.filter(note => note.semester === semesterFilter);
    }

    if (subjectFilter) {
      filtered = filtered.filter(note =>
        note.subjectName.toLowerCase().includes(subjectFilter.toLowerCase())
      );
    }

    setFilteredNotes(filtered);
  }, [yearFilter, semesterFilter, subjectFilter, notes]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Notes</h2>

      {/* Filters */}
      <div className="mb-4">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="mr-2"
        >
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="mr-2"
        >
          <option value="">Select Semester</option>
          <option value="1st Sem">1st Sem</option>
          <option value="2nd Sem">2nd Sem</option>
        </select>

        <input
          type="text"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          placeholder="Search by Subject Name"
          className="border p-2 rounded"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-gray-600">No notes available</p>
      ) : (
        <ul className="space-y-4">
          {filteredNotes.map((note) => (
            <li
              key={note._id}
              className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold">{note.subjectName}</h3>
              <p className="text-gray-700">
                Year: <span className="font-medium">{note.year}</span>
              </p>
              <p className="text-gray-700">
                Semester: <span className="font-medium">{note.semester}</span>
              </p>
              <p className="text-gray-700">
                Branch: <span className="font-medium">{note.branch}</span>
              </p>
              <a
                href={note.fileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline mt-2 inline-block"
              >
                View File
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShowNotes;
