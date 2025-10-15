import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};


export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};


export const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const newUser = await User.create({ email, password: hashed, role: role || "user" });
  res.status(201).json({ message: "User created", user: { _id: newUser._id, email: newUser.email, role: newUser.role } });
};


export const updateUser = async (req, res) => {
  const { email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (email) user.email = email;
  if (role) user.role = role;

  await user.save();
  res.json({ message: "User updated", user: { _id: user._id, email: user.email, role: user.role } });
};


export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted" });
};
