import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HashLoader } from "react-spinners";

import "./App.css";

import Error from "./component/Error";
import Navbar from "./component/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Upload from "./Pages/Upload";
import About from "./Pages/About";
import Notes from "./Pages/Notes";
import Admin from "./Pages/Admin";
import ResetPassword from "./component/ResetPassword";

const Loader = ({ loading }) => {
  if (!loading) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
      }}
    >
      <HashLoader color="#75c2e1" size={65} speedMultiplier={2} />
    </div>  
  );
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <div>
      <Loader loading={loading} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<Login />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="about" element={<About />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
