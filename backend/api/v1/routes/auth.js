import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import pool from '../../db/index.js';

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
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", (req, res, next)=>{
  console.log('inside backend login api');
  next()
}, passport.authenticate('local'),(req, res) =>{
  console.log('after authentication sending user', req.user);
  res.json({user: req.user})
});

router.get("/google",(req, res, next) =>{
  console.log('redirecting to google oauth');
  next()
}, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google callback reached. User is being authenticated...");
    next();
  },
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    console.log("User successfully authenticated. Redirecting to frontend...");
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
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

export default router;
