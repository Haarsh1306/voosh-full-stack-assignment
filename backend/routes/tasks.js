const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const authenticateToken = require("../middleware/authenticate");
const {
  createTaskSchema,
  updateTaskSchema,
} = require("../validation/validationSchema");

router.get("/get", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT task_id, title, description, status, created_at 
            FROM tasks 
            WHERE user_id = $1 AND is_deleted = false`,
      [req.user.user_id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/create", authenticateToken, async (req, res) => {
  const body = req.body;
  const { success, data, error } = createTaskSchema.safeParse(body);
  if (!success) {
    return res.status(400).json({ success: false, error: error.errors });
  }
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [data.title, data.description, req.user.user_id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/update/:id", authenticateToken, async (req, res) => {
    const body = req.body;
    const { success, data, error } = updateTaskSchema.safeParse(body);
    if(!success) {
        return res.status(400).json({ success: false, error: error.errors });
    }
    try {
        const result = await pool.query(
            "UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status) WHERE task_id = $4 AND user_id = $5 RETURNING *",
            [data.title, data.description, data.status, req.params.id, req.user.user_id]
        );
        if(!result.rows.length) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }

});

router.delete("/delete/:id", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
        "UPDATE tasks SET is_deleted = true WHERE task_id = $1 AND user_id = $2 RETURNING *",
        [req.params.id, req.user.user_id]
        );
        if (!result.rows.length) {
        return res.status(404).json({ success: false, error: "Task not found" });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
