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
import pool from "./api/db/index.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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
    maxAge: 2 * 60 * 60 * 1000, 
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/api',api)
app.use("/api/v1/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
