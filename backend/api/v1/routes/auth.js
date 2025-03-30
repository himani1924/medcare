import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import pool from '../../db/index.js';
import { forgotPassword, resetPassword, verifyOtp } from "../services/passwordServices.js";

const router = express.Router();

// Sign up
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, 'patient']
    );

    //login user after sign in
    req.login(newUser.rows[0], (err) => {
      if (err) return res.status(500).json({ message: "Error logging in after signup" });
      return res.status(201).json({ user: newUser.rows[0] });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", passport.authenticate('local'),(req, res) =>{
  res.json({user: req.user})
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(  "/google/callback", passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),(req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    req.session.destroy(async () => {
      res.clearCookie("connect.sid");
      try {
        await pool.query("DELETE FROM session WHERE sid = $1", [sessionID]);
      } catch (error) {
        console.error("Error deleting session from DB:", error);
      }
      res.json({ message: "Logged out successfully" });
    });
  });
});

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)

export default router;
