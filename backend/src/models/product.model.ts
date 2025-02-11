import mongoose from 'mongoose';

const turkishToEnglish = (text: string): string => {
  const charMap: { [key: string]: string } = {
    'ı': 'i', 'İ': 'i',
    'ğ': 'g', 'Ğ': 'g',
    'ü': 'u', 'Ü': 'u',
    'ş': 's', 'Ş': 's',
    'ö': 'o', 'Ö': 'o',
    'ç': 'c', 'Ç': 'c',
  };
  
  return text.replace(/[ıİğĞüÜşŞöÖçÇ]/g, match => charMap[match]);
};

export interface IProduct {
  name: string;
  slug: string;
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
    slug: {
      type: String,
      unique: true,
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

// Generate slug from name before saving
productSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  
  // Convert Turkish characters to English and create slug
  const normalizedName = turkishToEnglish(this.name);
  this.slug = normalizedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  next();
});

// Handle duplicate slug errors
productSchema.post('save', function(error: any, doc: any, next: any) {
  if (error.name === 'MongoServerError' && error.code === 11000 && error.keyPattern?.slug) {
    const timestamp = Date.now();
    doc.slug = `${doc.slug}-${timestamp}`;
    doc.save();
  } else {
    next(error);
  }
});

// Add index for search functionality
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ slug: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema); 