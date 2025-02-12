import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Protected routes (require authentication)
router.post('/create-payment-intent', protect, createPaymentIntent);

// Public routes
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router; 