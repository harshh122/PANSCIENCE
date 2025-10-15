import React, { useEffect, useState } from "react";
import API from "../services/api.js";
import { Link } from "react-router-dom";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ status: "", priority: "" });

  useEffect(() => {
    API.get("/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  
  const filteredTasks = tasks.filter(task => {
    return (
      (filter.status === "" || task.status === filter.status) &&
      (filter.priority === "" || task.priority === filter.priority)
    );
  });

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Filter Controls */}
      <div className="mb-4 flex gap-4">
        <select
          value={filter.status}
          onChange={e => setFilter({ ...filter, status: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={filter.priority}
          onChange={e => setFilter({ ...filter, priority: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Task Table */}
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2">Priority</th>
            <th className="py-2">Due</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(t => (
            <tr key={t._id} className="border-b hover:bg-gray-50">
              <td className="py-2">
                <Link to={`/tasks/${t._id}`} className="text-blue-600">{t.title}</Link>
              </td>
              <td className="py-2">{t.status}</td>
              <td className="py-2">{t.priority}</td>
              <td className="py-2">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
