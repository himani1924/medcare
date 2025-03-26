import doctorController from './controllers/doctorController.js'
import slotsController from './controllers/slotsController.js'
import adminController from './controllers/adminController.js'
import express from 'express'
const router = express.Router();
router.use('/doctors', doctorController);
router.use('/slots', slotsController );
router.use('/admin', adminController)

export default router;