import { Routes, Route } from "react-router-dom";
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
import Footer from "./component/Footer";
import Header from "./component/Header";

const App = () => {
  return (
    <div className="flex-row">
      <div className="bg-transparent">
       <Header/>
      </div>
      <div className="">
        <Navbar />
      </div>     
      <div className=" lg:ml-16 md:ml-16 transition-all">
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
      <div className=" h-[3rem] pt-2 ">
       <Footer/>
      </div>
    </div>
  );
};

export default App;
