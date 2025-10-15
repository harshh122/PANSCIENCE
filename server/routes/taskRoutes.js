import express from "express";
import upload from "../config/upload.js"; // ✅ Local storage (uploads/)
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protect all task routes (only logged-in users can access)
router.use(protect);

/**
 * @route   GET /api/tasks
 * @desc    Fetch all tasks (admin: all tasks, user: their own)
 * @route   POST /api/tasks
 * @desc    Create a new task with optional documents (up to 3 files)
 */
router
  .route("/")
  .get(getTasks)
  .post(upload.array("documents", 3), createTask);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @route   PUT /api/tasks/:id
 * @desc    Update task (admin or creator/assignee)
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task (admin or creator/assignee)
 */
router
  .route("/:id")
  .get(getTaskById)
  .put(upload.array("documents", 3), updateTask)
  .delete(deleteTask);

export default router;
