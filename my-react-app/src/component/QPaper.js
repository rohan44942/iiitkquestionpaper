import React from 'react';
import { FaDownload, FaEye, FaTrash } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";

const QPaper = ({ data }) => {
  const {
    file,
    apiUrl,
    user,
    admin1,
    admin2,
    observer,
    handleDelete,
  } = data;

  return (
    <div
      key={file._id}
      ref={observer}
      className="rounded-2xl bg-white p-6 shadow-lg flex flex-col space-y-4"
    >
      <div className="flex-shrink-0">
        {file.filename.endsWith(".pdf") ? (
          <iframe
            title="PDF Preview"
            style={{ display: "block" }}
            className="w-full h-56 border border-gray-200 rounded-lg"
            src={`${apiUrl}/api/uploads/${file.filename}`}
            loading="lazy"
          />
        ) : (
          <LazyLoadImage
            alt={file.filename}
            effect="blur"
            className="w-full h-56 object-cover cursor-pointer rounded-lg hover:opacity-90 shadow"
            src={`${apiUrl}/api/uploads/${file.filename}`}
          />
        )}
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-semibold pb-2 text-blue-500 hover:underline">
          <a
            href={`${apiUrl}/api/uploads/${file.filename}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {file.metadata.fileName || file.filename}
          </a>
        </h3>
        <p className="text-gray-700 text-sm mb-1">
          <strong>Description:</strong> {file.metadata.description || "No description"}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <strong>Year:</strong> {file.metadata.year}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <strong>Branch:</strong> {file.metadata.branch}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <strong>Uploaded by:</strong> {file.metadata.uploadedBy || "A Helper"}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <strong>Uploaded on:</strong>{" "}
          {new Date(file.uploadDate).toLocaleDateString("en-CA")}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          <strong>File Size:</strong> {(file.length / 1000).toFixed(2)} Kb
        </p>

        <div className="mt-4 flex flex-col space-y-3">
          <a
            href={`${apiUrl}/api/download/${file.filename}`}
            className="flex items-center text-blue-500 font-medium hover:text-blue-800 transition-colors duration-300"
          >
            <FaDownload className="mr-2" /> Download
          </a>
          <a
            href={`${apiUrl}/api/uploads/${file.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 font-medium hover:text-blue-800 transition-colors duration-300"
          >
            <FaEye className="mr-2" /> View
          </a>
          {(user?.role === "admin" ||
            user?.email === admin1 ||
            user?.email === admin2) && (
            <button
              onClick={() => handleDelete(file._id, "exam")}
              className="flex items-center text-red-700 font-medium hover:text-red-800 transition-colors duration-300"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QPaper;
