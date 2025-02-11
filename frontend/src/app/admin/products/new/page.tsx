'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  category: yup.string().required('Category is required'),
  brand: yup.string().required('Brand is required'),
  countInStock: yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative'),
});

type ProductFormData = yup.InferType<typeof schema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      // First, upload images to get their URLs
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const imageUploadResponse = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Then create the product with image URLs
      const productData = {
        ...data,
        images: imageUploadResponse.data.urls,
      };

      await axios.post(`${API_URL}/products`, productData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                {...register('brand')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register('category')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Living</option>
                <option value="sports">Sports</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                {...register('countInStock')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.countInStock && (
                <p className="mt-1 text-sm text-red-600">{errors.countInStock.message}</p>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 