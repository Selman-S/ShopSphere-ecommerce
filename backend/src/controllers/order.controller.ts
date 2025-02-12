import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { ApiError } from '../utils/ApiError';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received order creation request:', req.body);
    console.log('User from request:', req.user);

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      throw new ApiError(400, 'No order items');
    }

    if (!shippingAddress) {
      throw new ApiError(400, 'Shipping address is required');
    }

    if (!paymentMethod) {
      throw new ApiError(400, 'Payment method is required');
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    console.log('Order created successfully:', order);
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message || 'Failed to create order' });
    }
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Check if the order belongs to the logged-in user or if the user is an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to access this order');
    }

    res.json(order);
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
}; 