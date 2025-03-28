import express from "express";
import { approveSlot, createDoctor, deleteDoctor, deleteSlot, getAllDoctors, getAllSlots, updateDoctor } from "../services/adminServices.js";
const router = express.Router();
import adminAuth from '../routes/admin.js'
import upload from '../utils/multer.js'

router.use('/auth', adminAuth)

router.post("/create-doctor", upload.single('profile_image'),createDoctor);
router.get('/doctors', getAllDoctors)
router.put('/update/:id', upload.single('profile_image'), updateDoctor)
router.get('/slots', getAllSlots)
router.post('/delete-slot/:slotId', deleteSlot)
router.post('/approve-slot/:slotId',approveSlot)
router.delete('/delete-doctor/:id', deleteDoctor)

export default router;

