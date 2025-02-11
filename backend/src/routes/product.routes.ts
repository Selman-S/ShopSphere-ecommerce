import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:slug')
  .get(getProductBySlug)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:slug/reviews').post(protect, createProductReview);

export default router; 