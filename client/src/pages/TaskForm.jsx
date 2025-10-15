import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api.js";

export default function TaskForm({ isEdit = false }) {
  const { id } = useParams(); // used in edit mode
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });

  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.role === "admin") {
      API.get("/users")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, [user?.role]);

  useEffect(() => {
    const fetchTask = async () => {
      if (!isEdit) return;
      try {
        setFetching(true);
        const res = await API.get(`/tasks/${id}`);
        const t = res.data;

        setForm({
          title: t.title,
          description: t.description || "",
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "",
          assignedTo: t.assignedTo?._id || "",
        });
      } catch (err) {
        console.error("Error fetching task:", err);
        setMsg(err.response?.data?.message || "Failed to fetch task details");
      } finally {
        setFetching(false);
      }
    };
    fetchTask();
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("status", form.status);
      formData.append("priority", form.priority);
      formData.append("dueDate", form.dueDate);

      formData.append(
        "assignedTo",
        user.role === "admin" ? form.assignedTo : user._id
      );

      // Append new files
      files.forEach((file) => formData.append("documents", file));

      if (isEdit) {
        await API.put(`/tasks/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Task updated successfully!");
      } else {
        await API.post("/tasks", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Task created successfully!");
      }

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error("Error submitting task:", err);
      setMsg(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-center mt-6">Loading task...</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Task" : "Create Task"}
      </h2>

      {msg && (
        <p
          className={`mb-3 ${
            msg.startsWith("") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <div className="flex gap-3">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded flex-1"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border p-2 rounded flex-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {user?.role === "admin" && (
          <div>
            <label className="block text-sm mb-1">Assign To:</label>
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">-- Select User --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.email} ({u.role})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Attach File(s):</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          {files.length > 0 && (
            <ul className="text-sm mt-1 list-disc ml-4">
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3 justify-between mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Task"
              : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
