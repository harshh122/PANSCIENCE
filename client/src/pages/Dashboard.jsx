import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link to="/tasks/new" className="bg-green-600 text-white px-3 py-1 rounded">+ New Task</Link>
      </div>
      <Outlet />
    </div>
  );
}
