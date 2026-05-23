import express from 'express';
import {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  updateDriverAvailability,
  deleteDriver,
  getDriverStats,
} from '../controllers/driverController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Statistics
router.get('/stats/summary', admin, getDriverStats);

// CRUD operations - admin only for create, update, delete
router.route('/').get(getDrivers).post(admin, createDriver);
router
  .route('/:id')
  .get(getDriverById)
  .put(admin, updateDriver)
  .delete(admin, deleteDriver);

// Availability update - admin only
router.patch('/:id/availability', admin, updateDriverAvailability);

export default router;
