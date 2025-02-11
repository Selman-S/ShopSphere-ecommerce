import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Array<{
    user: mongoose.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
      trim: true,
    },
    images: [{
      type: String,
      required: [true, 'Please add at least one image'],
    }],
    countInStock: {
      type: Number,
      required: [true, 'Please add count in stock'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add index for search functionality
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema); 