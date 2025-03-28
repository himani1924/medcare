import express from "express";
import { bookSlot, getSlots, slotsByUserId } from "../services/slotService.js";
const router = express.Router();

router.get('/:doctorId', getSlots)
router.post('/book', bookSlot)
router.get('/getslot/:userId', slotsByUserId)

export default router;