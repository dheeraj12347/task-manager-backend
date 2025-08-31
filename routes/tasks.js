import express from "express";
import { pool } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();
router.use(authRequired);

// Get all tasks of the current user
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("get tasks", err);
    res.status(500).json({ error: "failed to fetch tasks" });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });

    const [result] = await pool.query(
      "INSERT INTO tasks (user_id, title, description, completed) VALUES (?, ?, ?, ?)",
      [req.user.id, title, description || null, 0]
    );
    const insertId = result.insertId;
    const [rows] = await pool.query("SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE id = ?", [insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("create task", err);
    res.status(500).json({ error: "failed to create task" });
  }
});

// Update task (title, description, completed)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    // check ownership
    const [found] = await pool.query("SELECT id FROM tasks WHERE id = ? AND user_id = ?", [id, req.user.id]);
    if (!found.length) return res.status(404).json({ error: "task not found" });

    await pool.query(
      "UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), completed = COALESCE(?, completed), updated_at = NOW() WHERE id = ?",
      [title, description, (completed === undefined ? null : (completed ? 1 : 0)), id]
    );

    const [rows] = await pool.query("SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("update task", err);
    res.status(500).json({ error: "failed to update task" });
  }
});

// Toggle completed status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const [found] = await pool.query("SELECT completed FROM tasks WHERE id = ? AND user_id = ?", [id, req.user.id]);
    if (!found.length) return res.status(404).json({ error: "task not found" });
    const current = found[0].completed ? 1 : 0;
    const newVal = current ? 0 : 1;
    await pool.query("UPDATE tasks SET completed = ?, updated_at = NOW() WHERE id = ?", [newVal, id]);
    const [rows] = await pool.query("SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("toggle task", err);
    res.status(500).json({ error: "failed to toggle status" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [found] = await pool.query("SELECT id FROM tasks WHERE id = ? AND user_id = ?", [id, req.user.id]);
    if (!found.length) return res.status(404).json({ error: "task not found" });

    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("delete task", err);
    res.status(500).json({ error: "failed to delete task" });
  }
});

export default router;
