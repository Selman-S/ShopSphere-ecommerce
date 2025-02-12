import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../models/order.model';
import { ApiError } from '../utils/ApiError';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
});

// @desc    Create payment intent for Stripe
// @route   POST /api/payment/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, items } = req.body;

    if (!amount || !items || items.length === 0) {
      throw new ApiError(400, 'Invalid request data');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        items: JSON.stringify(items),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Webhook handler for Stripe events
// @route   POST /api/payment/webhook
// @access  Public
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  let event;
  try {
    const sig = req.headers['stripe-signature'];

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Webhook signature or secret is missing');
    }

    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Received webhook event:', event.type);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Processing payment success:', paymentIntent.id);

        try {
          // Check if order already exists
          const existingOrder = await Order.findOne({
            'paymentResult.id': paymentIntent.id
          });

          if (existingOrder) {
            console.log('Order already exists:', existingOrder._id);
            res.json({ received: true });
            return;
          }

          // Parse metadata
          const items = JSON.parse(paymentIntent.metadata.items || '[]');
          const userId = paymentIntent.metadata.userId;

          if (!items.length || !userId) {
            throw new Error('Invalid payment metadata');
          }

          // Calculate totals
          const itemsTotal = items.reduce((acc: number, item: any) => {
            return acc + (item.price * item.quantity);
          }, 0);

          const shippingPrice = 10;
          const taxRate = 0.18;
          const taxPrice = itemsTotal * taxRate;
          const totalPrice = itemsTotal + shippingPrice + taxPrice;

          // Create order
          const order = await Order.create({
            user: userId,
            orderItems: items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
              product: item.id,
            })),
            shippingAddress: {}, // Will be updated from frontend
            paymentMethod: 'stripe',
            itemsPrice: itemsTotal,
            shippingPrice,
            taxPrice,
            totalPrice,
            isPaid: true,
            paidAt: new Date(),
            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: paymentIntent.receipt_email || '',
            },
          });

          console.log('Created new order:', order._id);
        } catch (error) {
          console.error('Error processing payment success:', error);
          throw error;
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }
}; 