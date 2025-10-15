import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});


API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch (e) {}
  return config;
});

export default API;
