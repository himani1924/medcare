import express from "express";
import { getAllDoctors, getDoctorById, getRating, rateDoctor } from "../services/doctorServices.js";
const router = express.Router();

router.get("/", getAllDoctors);
router.post('/:doctorId/rate', rateDoctor)
router.get('/:doctorId/getratings', getRating)
router.get('/:id', getDoctorById)

export default router;