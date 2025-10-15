import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api.js";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.error("❌ Error fetching task:", err);
        setError(err.response?.data?.message || "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;
  if (!task) return <p className="text-center mt-4">Task not found</p>;

  const apiRoot =
    import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  
  const canModify =
    user?.role === "admin" ||
    user?._id === task.createdBy?._id ||
    user?._id === task.assignedTo?._id;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      setDeleting(true);
      await API.delete(`/tasks/${id}`);
      alert("✅ Task deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("❌ Error deleting task:", err);
      alert(err.response?.data?.message || "Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  
  const handleEdit = () => {
    navigate(`/tasks/edit/${id}`);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Task Details</h2>

      <div className="mb-2">
        <strong>Title:</strong> {task.title}
      </div>
      <div className="mb-2">
        <strong>Description:</strong> {task.description || "-"}
      </div>
      <div className="mb-2">
        <strong>Status:</strong> {task.status}
      </div>
      <div className="mb-2">
        <strong>Priority:</strong> {task.priority}
      </div>
      <div className="mb-2">
        <strong>Due Date:</strong>{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
      </div>
      <div className="mb-2">
        <strong>Assigned To:</strong>{" "}
        {task.assignedTo
          ? `${task.assignedTo.email} (${task.assignedTo.role})`
          : "-"}
      </div>
      <div className="mb-2">
        <strong>Created By:</strong>{" "}
        {task.createdBy
          ? `${task.createdBy.email} (${task.createdBy.role})`
          : "-"}
      </div>

      {/*  Attached Documents */}
      <div className="mb-4">
        <strong>Documents:</strong>{" "}
        {task.documents?.length > 0 ? (
          <ul className="list-disc ml-6 mt-2">
            {task.documents.map((doc, index) => {
              const filePath = doc.path
                ? `${apiRoot}/${doc.path}`
                : `${apiRoot}/uploads/${doc.filename}`;
              return (
                <li key={index}>
                  <a
                    href={filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {doc.originalname || `Document ${index + 1}`}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          "-"
        )}
      </div>

      {/*  Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Back
        </button>

        {canModify && (
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
