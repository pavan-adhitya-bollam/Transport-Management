import express from 'express';
import {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  updateDeliveryStatus,
  deleteDelivery,
  getDeliveryStats,
} from '../controllers/deliveryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Statistics - admin only
router.get('/stats/summary', admin, getDeliveryStats);

// CRUD operations - admin only for update, delete
router.route('/').get(getDeliveries).post(createDelivery);
router
  .route('/:id')
  .get(getDeliveryById)
  .put(admin, updateDelivery)
  .delete(admin, deleteDelivery);

// Status update - drivers can update their own assigned deliveries
router.patch('/:id/status', updateDeliveryStatus);

export default router;
