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
import CommunityPage from "./Pages/CommunityPage";
import CommunityPostPage from "./Pages/CommunityPostPage";
import ResetPassword from "./component/ResetPassword";
import Footer from "./component/Footer";
import Header from "./component/Header";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-grow w-full pt-14 md:pt-0 md:pl-[4.75rem] transition-all duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<Login />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/about" element={<About />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:id" element={<CommunityPostPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
      <div className="md:pl-[4.75rem]">
        <Footer />
      </div>
    </div>
  );
};

export default App;
