import express from "express";
import {
  createNote,
  deleteNote,
  gettAllNotes,
  updateNote,
  getNoteById,
} from "../controllers/notesController.js";
const router = express.Router();

export default router;

router.get("/", gettAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
