import express from "express";
const router = express.Router();
import { getAllUsers, getUser, createUser, editUser, deleteUser } from "../controllers/usercontroller.js";

// Get Requests
router.get("/", getAllUsers);
router.get("/:id", getUser);

// Post Requests
router.post('/', createUser);

// Put Requests
router.put("/:id", editUser);

// Delete Requests
router.delete("/:id", deleteUser);

export default router;