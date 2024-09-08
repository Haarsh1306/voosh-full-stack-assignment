const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authenticate");
const passport = require('../passportAuth');
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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [data.first_name, data.last_name, data.email, hashedPassword]
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

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      data.email,
    ]);

    if (!result.rows.length) {
      return res
        .status(400)
        .json({ success: false, error: "Email not registered" });
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      result.rows[0].password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: "Wrong password" });
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

router.get('/me', authenticateToken, async (req, res) => {
    res.status(200).json({ success: true, data: req.user });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login",
    session: false,
  }),
  function (req, res) {
    const accessToken = jwt.sign(
      { email: req.user.email, user_id: req.user.user_id },
      process.env.JWT_SECRET
    );
    const url = 'https://voosh-full-stack-assignment-frontend.vercel.app/login?token=' + accessToken;
    res.redirect(url);
  }
);

module.exports = router;
