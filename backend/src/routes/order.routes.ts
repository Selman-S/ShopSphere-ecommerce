import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
} from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

export default router; 