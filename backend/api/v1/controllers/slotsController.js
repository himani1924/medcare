import express from "express";
import { bookSlot, getSlots, slotsByUserId } from "../services/slotService.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.get('/:doctorId', isAuthenticated, getSlots)
router.post('/book', isAuthenticated, bookSlot)
router.get('/getslot/:userId', isAuthenticated, slotsByUserId)

export default router;