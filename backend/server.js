// backend/server.js
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import api from './api/index.js';
import './api/v1/auth/passportSetup.js'
import pgSession from "connect-pg-simple";
import authRoutes from './api/v1/routes/auth.js'
import doctorsRoute from './api/v1/routes/doctors.js'
import pool from "./api/db/index.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Allow frontend
  credentials: true, // Allow cookies & authentication
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const PgStore = pgSession(session);
app.use(session({
  store: new PgStore({
    pool,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000, 
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/api',api)
app.use("/api/v1/auth", authRoutes);
// app.use('/api/v1/doctors')


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
