import "./App.css";
import Error from "./component/Error";
import Navbar from "./component/Navbar";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Upload from "./Pages/Upload";
import About from "./Pages/About";
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path ="about" element={<About/>}/>
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
