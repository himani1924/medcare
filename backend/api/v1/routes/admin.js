import express from "express";
import passport from "passport";

const router = express.Router();

// Login
router.post("/login", passport.authenticate('local'),(req, res) =>{
  console.log('after authentication sending user', req.user);
  res.json({user: req.user})
});

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
