import express from 'express';
import {
  getDeliveryStats,
  getMonthlyStats,
  getDriverPerformance,
  getVehicleUsage,
  getSchedule,
  getDashboardStats,
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Statistics endpoints
router.get('/delivery-stats', getDeliveryStats);
router.get('/monthly-stats', getMonthlyStats);
router.get('/driver-performance', getDriverPerformance);
router.get('/vehicle-usage', getVehicleUsage);
router.get('/schedule', getSchedule);
router.get('/dashboard-stats', getDashboardStats);

export default router;
