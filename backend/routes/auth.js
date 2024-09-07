const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const jwt = require("jsonwebtoken");
const {
  registerSchema,
  loginSchema,
} = require("../validation/validationSchema");

router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    const { success, data, error } = registerSchema.safeParse(body);

    if (!success) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    const alreadyExist = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [data.email]
    );

    if (alreadyExist.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [data.name, data.email, data.password]
    );

    res.status(201).json({
      success: true,
      data: {
        name: result.rows[0].name,
        email: result.rows[0].email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const { success, data, error } = loginSchema.safeParse(body);

    if (!success) {
      return res.status(400).json({ success: false, error: error.errors });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [data.email, data.password]
    );

    if (!result.rows.length) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: result.rows[0].email, user_id: result.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ success: true, token });
  } catch {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
