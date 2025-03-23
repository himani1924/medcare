import doctorController from './controllers/doctorController.js'
import express from 'express'
const router = express.Router();
router.use('/doctors', doctorController);

export default router;