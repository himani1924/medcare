import express from "express";
import { approveSlot, createDoctor, deleteSlot, getAllDoctors, getAllSlots, updateDoctor } from "../services/adminServices.js";
const router = express.Router();

router.post("/create-doctor", createDoctor);
router.get('/doctors', getAllDoctors)
router.put('/update/:id', updateDoctor)
router.get('/slots', getAllSlots)
router.delete('/delete-slot/:slotId', deleteSlot)
router.post('/approve-slot/:slotId',approveSlot)

export default router;

