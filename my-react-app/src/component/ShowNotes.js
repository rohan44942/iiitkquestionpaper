// // import React, { useEffect, useState, useRef } from "react";

// // function ShowNotes() {
// //   const [notes, setNotes] = useState([]);
// //   const [filteredNotes, setFilteredNotes] = useState([]);
// //   const [yearFilter, setYearFilter] = useState("");
// //   const [semesterFilter, setSemesterFilter] = useState("");
// //   const [subjectFilter, setSubjectFilter] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [hasMore, setHasMore] = useState(true);
// //   const notesPerPage = 10; // Define how many notes to load per page
// //   const apiurl = process.env.REACT_APP_API_URL;
// //   const observerRef = useRef();

// //   const fetchNotes = async () => {
// //     if (loading || !hasMore) return;

// //     setLoading(true);
// //     try {
// //       const response = await fetch(`${apiurl}/api/upload/notes?page=${currentPage}`);

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! Status: ${response.status}`);
// //       }

// //       const data = await response.json();

// //       if (!Array.isArray(data.notes)) {
// //         console.error("Expected notes to be an array but got:", data.notes);
// //         setHasMore(false);
// //         return;
// //       }

// //       if (data.notes.length < notesPerPage) {
// //         setHasMore(false);
// //       }

// //       setNotes((prevNotes) => [...prevNotes, ...data.notes]);
// //       setFilteredNotes((prevNotes) => [...prevNotes, ...data.notes]);
// //     } catch (error) {
// //       console.error("Error fetching notes:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchNotes();
// //   }, [currentPage, apiurl]);

// //   useEffect(() => {
// //     let filtered = notes;

// //     if (yearFilter) {
// //       filtered = filtered.filter((note) => note.year === yearFilter);
// //     }

// //     if (semesterFilter) {
// //       filtered = filtered.filter((note) => note.semester === semesterFilter);
// //     }

// //     if (subjectFilter) {
// //       filtered = filtered.filter((note) =>
// //         note.subjectName.toLowerCase().includes(subjectFilter.toLowerCase())
// //       );
// //     }

// //     setFilteredNotes(filtered);
// //   }, [yearFilter, semesterFilter, subjectFilter, notes]);

// //   const handleScroll = (entries) => {
// //     const target = entries[0];
// //     if (target.isIntersecting && !loading) {
// //       setTimeout(() => {
// //         setCurrentPage((prev) => prev + 1);
// //       }, 1000); // Delay before fetching more notes
// //     }
// //   };

// //   useEffect(() => {
// //     const observer = new IntersectionObserver(handleScroll);
// //     if (observerRef.current) {
// //       observer.observe(observerRef.current);
// //     }

// //     return () => {
// //       if (observerRef.current) {
// //         observer.unobserve(observerRef.current);
// //       }
// //     };
// //   }, [loading]);

// //   return (
// //     <div className="pt-20 max-w-3xl mx-auto p-6">
// //       <h2 className="text-2xl font-bold mb-4">Notes</h2>

// //       <div className="mb-4">
// //         <select
// //           value={yearFilter}
// //           onChange={(e) => setYearFilter(e.target.value)}
// //           className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
// //         >
// //           <option value="">Select Year</option>
// //           <option value="1st Year">1st Year</option>
// //           <option value="2nd Year">2nd Year</option>
// //           <option value="3rd Year">3rd Year</option>
// //           <option value="4th Year">4th Year</option>
// //         </select>

// //         <select
// //           value={semesterFilter}
// //           onChange={(e) => setSemesterFilter(e.target.value)}
// //           className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
// //         >
// //           <option value="">Select Semester</option>
// //           <option value="1st Sem">1st Sem</option>
// //           <option value="2nd Sem">2nd Sem</option>
// //         </select>

// //         <input
// //           type="text"
// //           value={subjectFilter}
// //           onChange={(e) => setSubjectFilter(e.target.value)}
// //           placeholder="Search by Subject Name"
// //           className="border p-2 rounded md: mt-3"
// //         />
// //       </div>

// //       {filteredNotes.length === 0 ? (
// //         <p className="text-gray-600">No notes available</p>
// //       ) : (
// //         <ul className="space-y-4">
// //           {filteredNotes.map((note) => (
// //             <li
// //               key={note._id}
// //               className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
// //             >
// //               <h3 className="text-xl font-semibold">{note.subjectName}</h3>
// //               <p className="text-gray-700">
// //                 Year: <span className="font-medium">{note.year}</span>
// //               </p>
// //               <p className="text-gray-700">
// //                 Semester: <span className="font-medium">{note.semester}</span>
// //               </p>
// //               <p className="text-gray-700">
// //                 Branch: <span className="font-medium">{note.branch}</span>
// //               </p>
// //               <a
// //                 href={note.fileLink}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="text-blue-500 hover:text-blue-700 underline mt-2 inline-block"
// //               >
// //                 View File
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       )}

// //       {loading && <p className="text-center">Loading more notes...</p>}

// //       <div ref={observerRef} className="h-1" />
// //     </div>
// //   );
// // }

// // export default ShowNotes;
// import React, { useEffect, useState, useRef } from "react";

// function ShowNotes() {
//   const [notes, setNotes] = useState([]);
//   const [filteredNotes, setFilteredNotes] = useState([]);
//   const [yearFilter, setYearFilter] = useState("");
//   const [semesterFilter, setSemesterFilter] = useState("");
//   const [subjectFilter, setSubjectFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const notesPerPage = 10; // Define how many notes to load per page
//   const apiurl = process.env.REACT_APP_API_URL;
//   const observerRef = useRef();

//   const fetchNotes = async (page) => {
//     if (loading || !hasMore) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`${apiurl}/api/upload/notes?page=${page}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (!Array.isArray(data.notes)) {
//         console.error("Expected notes to be an array but got:", data.notes);
//         setHasMore(false);
//         return;
//       }

//       setNotes((prevNotes) => [...prevNotes, ...data.notes]);
//       setFilteredNotes((prevNotes) => [...prevNotes, ...data.notes]);

//       if (data.notes.length < notesPerPage) {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error("Error fetching notes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotes(currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     let filtered = notes;

//     if (yearFilter) {
//       filtered = filtered.filter((note) => note.year === yearFilter);
//     }

//     if (semesterFilter) {
//       filtered = filtered.filter((note) => note.semester === semesterFilter);
//     }

//     if (subjectFilter) {
//       filtered = filtered.filter((note) =>
//         note.subjectName.toLowerCase().includes(subjectFilter.toLowerCase())
//       );
//     }

//     setFilteredNotes(filtered);
//   }, [yearFilter, semesterFilter, subjectFilter, notes]);

//   const handleScroll = (entries) => {
//     const target = entries[0];
//     if (target.isIntersecting && !loading) {
//       // setCurrentPage((prev) => prev + 1);
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleScroll);
//     if (observerRef.current) {
//       observer.observe(observerRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observer.unobserve(observerRef.current);
//       }
//     };
//   }, [loading]);

//   return (
//     <div className="pt-20 max-w-3xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Notes</h2>

//       <div className="mb-4">
//         <select
//           value={yearFilter}
//           onChange={(e) => setYearFilter(e.target.value)}
//           className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
//         >
//           <option value="">Select Year</option>
//           <option value="1st Year">1st Year</option>
//           <option value="2nd Year">2nd Year</option>
//           <option value="3rd Year">3rd Year</option>
//           <option value="4th Year">4th Year</option>
//         </select>

//         <select
//           value={semesterFilter}
//           onChange={(e) => setSemesterFilter(e.target.value)}
//           className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
//         >
//           <option value="">Select Semester</option>
//           <option value="1st Sem">1st Sem</option>
//           <option value="2nd Sem">2nd Sem</option>
//         </select>

//         <input
//           type="text"
//           value={subjectFilter}
//           onChange={(e) => setSubjectFilter(e.target.value)}
//           placeholder="Search by Subject Name"
//           className="border p-2 rounded md: mt-3"
//         />
//       </div>

//       {filteredNotes.length === 0 ? (
//         <p className="text-gray-600">No notes available</p>
//       ) : (
//         <ul className="space-y-4">
//           {filteredNotes.map((note) => (
//             <li
//               key={note._id}
//               className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
//             >
//               <h3 className="text-xl font-semibold">{note.subjectName}</h3>
//               <p className="text-gray-700">
//                 Year: <span className="font-medium">{note.year}</span>
//               </p>
//               <p className="text-gray-700">
//                 Semester: <span className="font-medium">{note.semester}</span>
//               </p>
//               <p className="text-gray-700">
//                 Branch: <span className="font-medium">{note.branch}</span>
//               </p>
//               <a
//                 href={note.fileLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:text-blue-700 underline mt-2 inline-block"
//               >
//                 View File
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}

//       {loading && <p className="text-center">Loading more notes...</p>}

//       <div ref={observerRef} className="h-1" />
//     </div>
//   );
// }

// export default ShowNotes;
import React, { useEffect, useState, useRef } from "react";

function ShowNotes() {
  const [notes, setNotes] = useState([]); // All notes
  const [filteredNotes, setFilteredNotes] = useState([]); // Filtered notes
  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const notesPerPage = 10; // Define how many notes to load per page
  const apiurl = process.env.REACT_APP_API_URL;
  const observerRef = useRef();

  const fetchNotes = async (page) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiurl}/api/upload/notes?page=${page}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.notes)) {
        console.error("Expected notes to be an array but got:", data.notes);
        setHasMore(false);
        return;
      }

      setNotes((prevNotes) => [...prevNotes, ...data.notes]);
      
      if (data.notes.length < notesPerPage) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(currentPage);
  }, [currentPage]);

  useEffect(() => {
    let filtered = notes;

    if (yearFilter) {
      filtered = filtered.filter((note) => note.year === yearFilter);
    }

    if (semesterFilter) {
      filtered = filtered.filter((note) => note.semester === semesterFilter);
    }

    if (subjectFilter) {
      filtered = filtered.filter((note) =>
        note.subjectName.toLowerCase().includes(subjectFilter.toLowerCase())
      );
    }

    setFilteredNotes(filtered);
  }, [yearFilter, semesterFilter, subjectFilter, notes]);

  // Handle scroll for infinite scrolling
  const handleScroll = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      setCurrentPage((prev) => prev + 1); // Increment page on scroll
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleScroll);
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]);

  return (
    <div className="pt-20 max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Notes</h2>

      <div className="mb-4">
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setCurrentPage(1); // Reset page to 1 when filter changes
          }}
          className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
        >
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <select
          value={semesterFilter}
          onChange={(e) => {
            setSemesterFilter(e.target.value);
            setCurrentPage(1); // Reset page to 1 when filter changes
          }}
          className="mr-2 border-gray-400 border-[0.01rem] rounded-md p-2"
        >
          <option value="">Select Semester</option>
          <option value="1st Sem">1st Sem</option>
          <option value="2nd Sem">2nd Sem</option>
        </select>

        <input
          type="text"
          value={subjectFilter}
          onChange={(e) => {
            setSubjectFilter(e.target.value);
            setCurrentPage(1); // Reset page to 1 when filter changes
          }}
          placeholder="Search by Subject Name"
          className="border p-2 rounded md: mt-3"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-gray-600">No notes available</p>
      ) : (
        <ul className="space-y-4">
          {filteredNotes.slice(0, currentPage * notesPerPage).map((note) => (
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

      {loading && <p className="text-center">Loading more notes...</p>}

      <div ref={observerRef} className="h-1" />
    </div>
  );
}

export default ShowNotes;
