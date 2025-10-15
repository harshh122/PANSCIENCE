import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { Task } from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const documents =
      req.files?.map((f) => ({
        filename: f.filename,
        path: `uploads/${f.filename}`,
        originalname: f.originalname,
      })) || [];

    const assignedUser = req.user.role === "admin" ? assignedTo : req.user._id;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: assignedUser,
      createdBy: req.user._id,
      documents,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, priority, sort = "-createdAt", page = 1, limit = 20 } = req.query;

    let query = Task.find();

    if (req.user.role === "user") {
      query = query.or([{ createdBy: req.user._id }, { assignedTo: req.user._id }]);
    }

    if (status) query = query.where("status").equals(status);
    if (priority) query = query.where("priority").equals(priority);

    const tasks = await query
      .populate("createdBy assignedTo", "email role")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(tasks);
  } catch (err) {
    console.error(" Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy assignedTo", "email role");

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role !== "admin" &&
      !req.user._id.equals(task.createdBy) &&
      !req.user._id.equals(task.assignedTo)
    ) {
      return res.status(403).json({ message: "Not authorized to view this task" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role !== "admin" &&
      !req.user._id.equals(task.createdBy) &&
      !req.user._id.equals(task.assignedTo)
    ) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    Object.assign(task, req.body);

    if (req.files && req.files.length > 0) {
      const newDocs = req.files.map((f) => ({
        filename: f.filename,
        path: `uploads/${f.filename}`,
        originalname: f.originalname,
      }));
      task.documents = [...task.documents, ...newDocs].slice(0, 3);
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role !== "admin" &&
      !req.user._id.equals(task.createdBy) &&
      !req.user._id.equals(task.assignedTo)
    ) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    if (task.documents && task.documents.length > 0) {
      for (const doc of task.documents) {
        const filePath = path.resolve(doc.path);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
          }
        }
      }
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
