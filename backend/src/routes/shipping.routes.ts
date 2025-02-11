import { Router } from 'express';
import {
  createShipping,
  updateShippingStatus,
  getShippingById,
  getShippingByOrderId,
} from '../controllers/shipping.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router
  .route('/')
  .post(protect, authorize('admin'), createShipping);

router
  .route('/:id')
  .get(protect, getShippingById)
  .put(protect, authorize('admin'), updateShippingStatus);

router
  .route('/order/:orderId')
  .get(protect, getShippingByOrderId);

export default router; 