import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import { createNote, getAllAndCategoryNotes, getArchivedNote, getDeletedNotes, permanentDelete, restoreNotes, softDeleteNote, toggleArchiveNote, togglePinNote, updateNote } from '../Controller/noteController.js';

const noteRouter = express.Router();

noteRouter.post("/", authMiddleware, createNote);
noteRouter.get("/", authMiddleware, getAllAndCategoryNotes);
noteRouter.put("/:noteId", authMiddleware, updateNote);
noteRouter.patch("/:noteId/pin", authMiddleware, togglePinNote);
noteRouter.patch("/:noteId/archive", authMiddleware, toggleArchiveNote);
noteRouter.delete("/:noteId", authMiddleware, softDeleteNote);
noteRouter.get("/archived", authMiddleware, getArchivedNote);
noteRouter.get("/deleted", authMiddleware, getDeletedNotes);
noteRouter.patch("/:noteId/restore", authMiddleware, restoreNotes);
noteRouter.delete("/:noteId/permanent", authMiddleware, permanentDelete);

export default noteRouter;