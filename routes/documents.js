import express from "express";
const router = express.Router();
import { getDocument, getAllDocuments, createDocument, updateDocument, deleteDocument } from "../controllers/documentcontroller.js";

// Post Request
router.post("/", createDocument);

// Get Request
router.get("/", getAllDocuments);
router.get("/:id", getDocument);

// Put Request
router.put("/:id", updateDocument);

// Delete Request
router.delete("/:id", deleteDocument)

export default router;