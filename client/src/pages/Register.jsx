import React, { useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

 
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!validate()) return; 

    setLoading(true);
    try {
      const res = await API.post("/auth/register", formData);
      setMsg("Registered successfully! Redirecting...");
      setTimeout(() => nav("/login"), 1500);
    } catch (error) {
      const err = error.response?.data;
      if (err?.errors) {
        const backendErrors = {};
        for (let key in err.errors) {
          backendErrors[key] = err.errors[key].message;
        }
        setErrors(backendErrors);
      } else {
        setMsg(err?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>

      {msg && <div className="mb-3 text-blue-600">{msg}</div>}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className={`w-full border p-2 rounded ${
              errors.email ? "border-red-500" : ""
            }`}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

       
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className={`w-full border p-2 rounded ${
              errors.password ? "border-red-500" : ""
            }`}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          disabled={loading}
          className={`w-full bg-blue-600 text-white p-2 rounded ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
