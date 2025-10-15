import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-blue-600">Task Manager</Link>
        <div className="flex items-center gap-4">
          {user?.role === "admin" && (
            <Link to="/admin" className="text-sm font-semibold text-green-600">Admin Panel</Link>
          )}
          {user && <span className="text-sm">{user.email}</span>}
          {user ? (
            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          ) : (
            <Link to="/login" className="text-blue-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
