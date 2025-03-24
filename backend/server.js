// backend/server.js
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import api from './api/index.js';
import './api/v1/auth/passportSetup.js'
import authRoutes from './api/v1/routes/auth.js'

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Allow frontend
  credentials: true, // Allow cookies & authentication
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/api',api)
app.use("/api/v1/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
