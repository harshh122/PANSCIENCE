import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TaskList from "./pages/TaskList.jsx";
import TaskForm from "./pages/TaskForm.jsx";
import TaskDetails from "./pages/TaskDetails.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Admin from "./pages/Admin.jsx";
import { AuthContext } from "./context/AuthContext.jsx";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
     
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<TaskList />} />
            <Route path="tasks/new" element={<TaskForm />} />
            <Route path="tasks/:id" element={<TaskDetails />} />
          </Route>

         
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {user?.role === "admin" ? <Admin /> : <Navigate to="/" />}
              </ProtectedRoute>
            }
          />

         
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
