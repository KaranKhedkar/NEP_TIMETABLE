
import { Routes, Route } from "react-router-dom";

import Home from "./pages/CommanPage/homepage"
import { AuthProvider } from "./contexts/authContext"
import Register from "./pages/CommanPage/register";
import Login from "./pages/CommanPage/login";

import AdminDashboard from "./pages/AdminPages/adminDashboard";
import FacultyDashboard from "./pages/FacultyPages/facultyDashboard";
import StudentDashboard from "./pages/StudentPages/studentDashboard";

export default function App() {
  return (
    <AuthProvider>

    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>} /> 


      <Route path="/dashboard" element={<AdminDashboard/>} /> 
      <Route path="/facultyDashboard" element={<FacultyDashboard/>}/>
      <Route path="/studentDashboard" element={<StudentDashboard/>}/>




    </Routes>
    </AuthProvider>
  );
}