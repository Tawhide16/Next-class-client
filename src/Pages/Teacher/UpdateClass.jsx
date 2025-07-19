import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAxios from '../../Hooks/UseAxios';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Prefill form on mount or id change
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axiosSecure.get(`/api/classes/${id}`);
        reset(res.data); // fill form with backend data
      } catch (err) {
        console.error('Failed to fetch class:', err);
        Swal.fire('Error', 'Failed to load class data', 'error');
      }
    };
    if (id) fetchClass();
  }, [id, reset, axiosSecure]);

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=aaf50483785ad23261d3f9a4759c7518`,
        formData
      );
      const imageUrl = res.data.data.display_url;
      setValue('image', imageUrl);

      Swal.fire({
        icon: 'success',
        title: 'Image uploaded!',
        toast: true,
        position: 'top-end',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      Swal.fire('Error', 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      // Sanitize and parse data before sending
      const updatedClass = {
        title: data.title?.trim() || '',
        description: data.description?.trim() || '',
        image: data.image || '',
        price: Number(data.price) || 0,
      };

      // Optional: Validate essential fields on client side again
      if (!updatedClass.title || !updatedClass.description) {
        Swal.fire('Error', 'Title and Description are required.', 'error');
        return;
      }

      // PATCH request to update class
      await axiosSecure.patch(`/api/classes/${id}`, updatedClass);

      Swal.fire({
        icon: 'success',
        title: 'Class updated!',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/dashboard/myClass');
    } catch (err) {
      console.error('Update failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: err.response?.data?.message || err.message || 'Something went wrong',
      });
    }
  };

  // Watch image for preview (optional)
  const imagePreview = watch('image');

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Update Class</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('title', { required: 'Title is required' })}
          placeholder="Title"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <input
          {...register('price', {
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' },
            valueAsNumber: true,
          })}
          type="number"
          placeholder="Price"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}

        <textarea
          {...register('description', { required: 'Description is required' })}
          placeholder="Short Description"
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          rows={4}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          disabled={uploading}
        />

        {/* Image preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Class Preview"
            className="mt-2 w-full max-h-48 object-cover rounded"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          {uploading ? 'Uploading Image...' : isSubmitting ? 'Updating...' : 'Update Class'}
        </button>
      </form>
    </div>
  );
};

export default UpdateClass;
