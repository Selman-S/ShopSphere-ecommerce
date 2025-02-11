'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import axios from 'axios';
import { ImagePlus, Loader2, Link as LinkIcon, X } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  category: yup.string().required('Category is required'),
  brand: yup.string().required('Brand is required'),
  countInStock: yup.number().integer('Stock must be an integer').min(0, 'Stock cannot be negative').required('Stock count is required'),
});

type ProductFormData = yup.InferType<typeof schema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuthStore();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin/products');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProduct();
  }, [id, user, router]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const product = response.data;

      // Set form values
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('category', product.category);
      setValue('brand', product.brand);
      setValue('countInStock', product.countInStock);

      // Set current images
      setCurrentImages(product.images);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error fetching product');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET!);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    
    setIsUploading(true);
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      setCurrentImages(prev => [...prev, ...urls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Error uploading images');
      console.error('Error uploading images:', error);
    }
    setIsUploading(false);
  };

  const handleImageUrlAdd = () => {
    if (imageUrl) {
      setCurrentImages(prev => [...prev, imageUrl]);
      setImageUrl('');
      toast.success('Image URL added');
    }
  };

  const handleRemoveImage = (index: number) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (currentImages.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    try {
      const productData = {
        ...data,
        images: currentImages,
      };

      await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating product');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              placeholder="Enter brand name"
              {...register("brand")}
            />
            {errors.brand && (
              <p className="text-sm text-red-600">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-2 relative z-50">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value: string) => setValue("category", value)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="sports">Sports & Outdoors</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Enter price"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="countInStock">Stock</Label>
            <Input
              id="countInStock"
              type="number"
              placeholder="Enter stock quantity"
              {...register("countInStock")}
            />
            {errors.countInStock && (
              <p className="text-sm text-red-600">{errors.countInStock.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Images</Label>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <Input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageChange}
                disabled={isUploading}
              />
              <Label
                htmlFor="image-upload"
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Upload Images
              </Label>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <Input
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleImageUrlAdd}
                disabled={!imageUrl}
                className="whitespace-nowrap"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Add URL
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter product description"
            {...register("description")}
            className="min-h-[120px]"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
          >
            {(isSubmitting || isUploading) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isUploading ? 'Uploading Images...' : 'Updating Product...'}
              </>
            ) : (
              'Update Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 