import express from "express";
import { addReview, getAllDoctors, getAllReviews, getDoctorById, getRating, getReviews, rateDoctor } from "../services/doctorServices.js";
const router = express.Router();

router.get("/", getAllDoctors);
router.post('/:doctorId/rate', rateDoctor)
router.get('/:doctorId/getratings', getRating)
router.post('/:doctorId/review', addReview)
router.get('/:doctorId/reviews',getReviews)
router.get('/allreviews',getAllReviews)
router.get('/:id', getDoctorById)

export default router;