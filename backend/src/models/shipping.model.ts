import mongoose from 'mongoose';

export interface IShipping {
  order: mongoose.Types.ObjectId;
  trackingNumber: string;
  carrier: 'PTT' | 'Yurtici' | 'Aras';
  status: 'processing' | 'in_transit' | 'delivered' | 'failed';
  estimatedDeliveryDate: Date;
  history: Array<{
    status: string;
    location: string;
    timestamp: Date;
    description: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const shippingSchema = new mongoose.Schema<IShipping>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    carrier: {
      type: String,
      enum: ['PTT', 'Yurtici', 'Aras'],
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'in_transit', 'delivered', 'failed'],
      default: 'processing',
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
    history: [
      {
        status: String,
        location: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Shipping = mongoose.model<IShipping>('Shipping', shippingSchema); 