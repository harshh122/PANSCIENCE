import express from "express";
import upload from "../config/upload.js"; // ✅ local storage instead of GridFS
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protect all routes
router.use(protect);

/**
 * @route   GET /api/tasks
 * @desc    Fetch all tasks (admin) or user’s own tasks
 * @route   POST /api/tasks
 * @desc    Create a new task with optional documents (up to 3)
 */
router
  .route("/")
  .get(getTasks)
  .post(upload.array("documents", 3), createTask); // ✅ multiple files allowed

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @route   PUT /api/tasks/:id
 * @desc    Update task details or re-upload documents
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
router
  .route("/:id")
  .get(getTaskById)
  .put(upload.array("documents", 3), updateTask)
  .delete(deleteTask);

export default router;
