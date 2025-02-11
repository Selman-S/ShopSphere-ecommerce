import { Request, Response } from 'express';
import { Shipping } from '../models/shipping.model';
import { Order } from '../models/order.model';
import { ApiError } from '../utils/ApiError';

// @desc    Create shipping tracking
// @route   POST /api/shipping
// @access  Private/Admin
export const createShipping = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, trackingNumber, carrier, estimatedDeliveryDate } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Create shipping tracking
    const shipping = await Shipping.create({
      order: orderId,
      trackingNumber,
      carrier,
      estimatedDeliveryDate,
      history: [{
        status: 'processing',
        location: 'Warehouse',
        description: 'Order has been processed and ready for shipping'
      }]
    });

    // Update order with shipping info
    order.isShipped = true;
    order.shippingInfo = shipping._id;
    await order.save();

    res.status(201).json(shipping);
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// @desc    Update shipping status
// @route   PUT /api/shipping/:id
// @access  Private/Admin
export const updateShippingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, location, description } = req.body;

    const shipping = await Shipping.findById(req.params.id);
    if (!shipping) {
      throw new ApiError(404, 'Shipping tracking not found');
    }

    shipping.status = status;
    shipping.history.push({
      status,
      location,
      timestamp: new Date(),
      description
    });

    const updatedShipping = await shipping.save();
    res.json(updatedShipping);
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// @desc    Get shipping tracking by ID
// @route   GET /api/shipping/:id
// @access  Private
export const getShippingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shipping = await Shipping.findById(req.params.id).populate('order');
    if (!shipping) {
      throw new ApiError(404, 'Shipping tracking not found');
    }

    res.json(shipping);
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// @desc    Get shipping tracking by order ID
// @route   GET /api/shipping/order/:orderId
// @access  Private
export const getShippingByOrderId = async (req: Request, res: Response): Promise<void> => {
  try {
    const shipping = await Shipping.findOne({ order: req.params.orderId });
    if (!shipping) {
      throw new ApiError(404, 'Shipping tracking not found for this order');
    }

    res.json(shipping);
  } catch (error: any) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};