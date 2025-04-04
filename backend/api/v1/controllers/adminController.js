import express from "express";
import { approveSlot, createDoctor, deleteDoctor, deleteSlot, getAllDoctors, getAllPendingSlots, getAllSlots, updateDoctor } from "../services/adminServices.js";
const router = express.Router();
import adminAuth from '../routes/admin.js'
import upload from '../utils/multer.js'
import { isAdmin } from "../middlewares/auth.js";

router.use('/auth', adminAuth)

router.post("/create-doctor", isAdmin, upload.single('profile_image'),createDoctor);
router.get('/doctors', isAdmin, getAllDoctors)
router.put('/update/:id', isAdmin, upload.single('profile_image'), updateDoctor)
router.get('/slots', isAdmin, getAllPendingSlots)
router.get('/all-slots', isAdmin, getAllSlots)
router.post('/delete-slot/:slotId', isAdmin, deleteSlot)
router.post('/approve-slot/:slotId',isAdmin, approveSlot)
router.delete('/delete-doctor/:id', isAdmin, deleteDoctor)



export default router;

