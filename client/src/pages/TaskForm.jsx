import React, { useEffect, useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function TaskForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  });

  const [files, setFiles] = useState([]); // ✅ handle multiple files
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch all users (for admin assignment)
  useEffect(() => {
    if (user?.role === "admin") {
      API.get("/users")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, [user?.role]);

  // ✅ Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle multiple file uploads
  const handleFileChange = (e) => {
    setFiles([...e.target.files]); // store all selected files
  };

  // ✅ Handle submit
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

      // ✅ Append all selected files as "documents"
      files.forEach((file) => {
        formData.append("documents", file);
      });

      await API.post("/tasks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("✅ Task created successfully!");
      setForm({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
        assignedTo: "",
      });
      setFiles([]);

      // Navigate back after short delay
      setTimeout(() => nav("/"), 1000);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "❌ Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Task</h2>

      {msg && <p className="mb-3 text-blue-600">{msg}</p>}

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
            multiple // ✅ allows selecting multiple files
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

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
