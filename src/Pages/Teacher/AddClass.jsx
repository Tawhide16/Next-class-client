import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Provider/AuthProvider';
import useAxios from '../../Hooks/UseAxios';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUpload, FiLoader, FiCheckCircle } from 'react-icons/fi';

const AddClass = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const imageUrl = watch('image');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      const imageUrl = res.data.data.display_url;
      setValue('image', imageUrl, { shouldValidate: true });

      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Image Uploaded Successfully!',
        showConfirmButton: false,
        timer: 1500,
        background: '#f8fafc',
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.message || 'Please try another image',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.image) {
      return Swal.fire({
        icon: 'error',
        title: 'Image Required',
        text: 'Please upload a class image first',
        confirmButtonColor: '#3b82f6',
      });
    }

    const newClass = {
      ...data,
      price: parseFloat(data.price),
      status: 'pending',
      totalEnrolled: 0,
      instructorId: user?.uid,
      createdAt: new Date().toISOString()
    };

    try {
      await axiosSecure.post('/api/classes', newClass);
      
      await Swal.fire({
        title: 'Success!',
        html: `
          <div class="text-center">
            <svg class="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mt-4">Class Submitted!</h3>
            <p class="text-gray-500 mt-2">Your class is under review</p>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
        background: '#f8fafc',
      });

      navigate('/allClass');
    } catch (error) {
      console.error('Submission error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        html: `
          <div class="text-left">
            <h3 class="font-medium">We couldn't process your request</h3>
            <p class="text-sm text-gray-500 mt-2">${error.response?.data?.message || error.message || 'Please try again later'}</p>
          </div>
        `,
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-6"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Create New Class
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fill out the form to add your class to our platform
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Class Title *
          </label>
          <input
            {...register('title', { 
              required: 'Title is required',
              minLength: {
                value: 5,
                message: 'Title should be at least 5 characters'
              }
            })}
            placeholder="e.g., Advanced Web Development"
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Instructor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructor Name
            </label>
            <input
              {...register('name')}
              disabled
              className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructor Email
            </label>
            <input
              {...register('email')}
              disabled
              className="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price (USD) *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
                max: { value: 1000, message: 'Price cannot exceed $1000' },
                valueAsNumber: true
              })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            {...register('description', { 
              required: 'Description is required',
              minLength: {
                value: 20,
                message: 'Description should be at least 20 characters'
              }
            })}
            placeholder="Describe what students will learn in this class..."
            rows={5}
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Class Image *
          </label>
          
          {!imageUrl ? (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>
          ) : (
            <div className="relative group">
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <img 
                  src={imageUrl} 
                  alt="Class preview" 
                  className="w-full h-48 object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setValue('image', '', { shouldValidate: true })}
                className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {uploading && (
            <div className="mt-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiLoader className="animate-spin" />
                <span>Uploading... {uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {imageUrl && !uploading && (
            <div className="flex items-center mt-3 text-sm text-green-600 dark:text-green-400">
              <FiCheckCircle className="mr-2" />
              <span>Image uploaded successfully</span>
            </div>
          )}

          <input
            {...register('image', { required: 'Image is required' })}
            type="hidden"
          />
          {errors.image && (
            <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className={`w-full px-6 py-3.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting || uploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <FiLoader className="animate-spin mr-2" />
                Uploading Image...
              </span>
            ) : isSubmitting ? (
              <span className="flex items-center justify-center">
                <FiLoader className="animate-spin mr-2" />
                Submitting...
              </span>
            ) : (
              'Submit Class'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddClass;