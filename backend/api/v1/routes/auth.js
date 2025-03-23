import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from '../api/db/index.js';

const router = express.Router();
// connectToDB()

// Sign up
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM patients WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
        console.log('user exists');
      return res.status(400).json({ message: "User already exists" });
    }
    console.log('user does not exist');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const newUser = await pool.query(
      "INSERT INTO patients (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    // Create JWT token
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('inside login');
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await pool.query(
      "SELECT * FROM patients WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: user.rows[0],
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/login',(req,res) => {
    console.log('Hello World');
})

export default router;
