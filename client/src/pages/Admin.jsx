import React, { useEffect, useState } from "react";
import API from "../services/api.js";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [msg, setMsg] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users", form);
      setMsg("User created successfully");
      setForm({ email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error creating user");
    }
  };

  const updateUser = async (id, role) => {
    try {
      await API.put(`/users/${id}`, { role });
      setMsg("Role updated");
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error updating user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/users/${id}`);
      setMsg("User deleted");
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error deleting user");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel — User Management</h2>
      {msg && <div className="text-sm text-green-600 mb-3">{msg}</div>}

      
      <form onSubmit={createUser} className="border p-4 mb-6 rounded">
        <h3 className="font-semibold mb-2">Create User</h3>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 flex-1"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 flex-1"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="border p-2"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      </form>

      
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Email</th>
            <th className="py-2 text-left">Role</th>
            <th className="py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="py-2">{u.email}</td>
              <td className="py-2">
                <select
                  value={u.role}
                  onChange={(e) => updateUser(u._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-2">
                <button
                  onClick={() => deleteUser(u._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
