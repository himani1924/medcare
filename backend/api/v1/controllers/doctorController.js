import express from "express";
import { addReview, getAllDoctors, getAllReviews, getDoctorById, getRating, getReviews, rateDoctor } from "../services/doctorServices.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.get("/", isAuthenticated, getAllDoctors);
router.post('/:doctorId/rate', isAuthenticated, rateDoctor)
router.get('/:doctorId/getratings', isAuthenticated, getRating)
router.post('/:doctorId/review', isAuthenticated, addReview)
router.get('/:doctorId/reviews',isAuthenticated, getReviews)
router.get('/allreviews',isAuthenticated, getAllReviews)
router.get('/:id', isAuthenticated, getDoctorById)

export default router;