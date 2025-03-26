import express from "express";
import { bookSlot, getSlots } from "../services/slotService.js";
const router = express.Router();

router.get('/:doctorId', getSlots)
router.post('/book', bookSlot)

export default router;