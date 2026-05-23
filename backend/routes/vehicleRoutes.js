import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  updateVehicleAvailability,
  deleteVehicle,
  getVehicleStats,
} from '../controllers/vehicleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Statistics
router.get('/stats/summary', admin, getVehicleStats);

// CRUD operations - admin only for create, update, delete
router.route('/').get(getVehicles).post(admin, createVehicle);
router
  .route('/:id')
  .get(getVehicleById)
  .put(admin, updateVehicle)
  .delete(admin, deleteVehicle);

// Availability update - admin only
router.patch('/:id/availability', admin, updateVehicleAvailability);

export default router;
