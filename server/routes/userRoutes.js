import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected and admin-only
router.use(protect, adminOnly);

router.route("/")
    .get(getUsers)      // Get all users
    .post(createUser);  // Create user

router.route("/:id")
    .get(getUserById)   // Get user by ID
    .put(updateUser)    // Update user
    .delete(deleteUser); // Delete user

export default router;
