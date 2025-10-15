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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Default route → Task List */}
            <Route index element={<TaskList />} />

            {/*  Create Task */}
            <Route path="tasks/new" element={<TaskForm />} />

            {/*  Edit Task */}
            <Route path="tasks/edit/:id" element={<TaskForm isEdit />} />

            {/*  Task Details */}
            <Route path="tasks/:id" element={<TaskDetails />} />
          </Route>

          {/* Admin Panel (only for admins) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {user?.role === "admin" ? <Admin /> : <Navigate to="/" />}
              </ProtectedRoute>
            }
          />

          {/* Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
