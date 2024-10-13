import { useState } from "react";
import Uploaddoc from "../component/Uploaddoc";
import Uploadnotes from "../component/Uploadnotes";

const Upload = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Select What You Want to Upload
      </h1>

      <select
        name="typeofpdf"
        id="typeofpdf"
        onChange={handleSelectChange}
        className="border border-gray-300 rounded p-2 mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">-- Select Option --</option>
        <option value="papers">Exam Papers</option>
        <option value="notes">Study Material (Notes)</option>
      </select>

      <div className="w-full max-w-md">
        {selectedOption === "notes" && <Uploadnotes />}
        {selectedOption === "papers" && <Uploaddoc />}
      </div>
    </div>
  );
};

export default Upload;
