import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import Uploaddoc from "../component/Uploaddoc";
import Uploadnotes from "../component/Uploadnotes";
import { UserContext } from "../contextapi/userContext";

const Upload = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const { isAuthenticated } = useContext(UserContext);

  return (
    <div className="page-shell max-w-2xl">
      <div className="mb-8 animate-fadeUp">
        <h1 className="page-title">Upload</h1>
        <p className="page-subtitle">
          Share exam papers or notes. Non-admin uploads wait for approval before
          going public.
        </p>
      </div>

      {isAuthenticated ? (
        <div className="surface-card p-6 sm:p-8 animate-fadeUp space-y-5">
          <label className="block text-sm font-medium text-ink">
            What are you uploading?
            <select
              name="typeofpdf"
              id="typeofpdf"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="field mt-2"
            >
              <option value="">Choose type</option>
              <option value="papers">Exam papers</option>
              <option value="notes">Study notes</option>
            </select>
          </label>

          {selectedOption === "notes" && <Uploadnotes />}
          {selectedOption === "papers" && <Uploaddoc />}
        </div>
      ) : (
        <div className="surface-card p-10 text-center animate-fadeUp">
          <p className="font-display text-xl text-ink">Login required</p>
          <p className="text-sm text-ink-muted mt-2 mb-5">
            Sign in to contribute papers and notes for the campus.
          </p>
          <NavLink to="/login" className="btn-primary">
            Go to login
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Upload;
