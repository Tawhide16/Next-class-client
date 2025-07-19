import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../Hooks/UseAxios';
import { AuthContext } from '../../Provider/AuthProvider';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiDollarSign,
  FiUser,
  FiMail,
  FiBook,
  FiLoader,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';

const ClassDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch single class by ID
  const { data: classInfo, isLoading, isError } = useQuery({
    queryKey: ['class-details', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/classes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Redirect to Stripe Checkout
  const handleRedirectToCheckout = () => {
    navigate(`/class/${id}/checkout`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-24 w-24 text-red-500">
          <FiAlertCircle className="w-full h-full" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load class</h3>
        <p className="mt-2 text-gray-500">Please try again later</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FiArrowLeft className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to Classes
      </button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={classInfo.image}
            alt={classInfo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {classInfo.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                <FiBook className="mr-1" />
                {classInfo.category || 'Course'}
              </span>
            </div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ${classInfo.price.toFixed(2)}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {classInfo.description}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <FiUser className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {classInfo.name}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FiMail className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                <p className="font-medium text-gray-900 dark:text-white break-all">
                  {classInfo.email}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FiClock className="text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p
                  className={`font-medium ${
                    classInfo.status === 'approved'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {classInfo.status.charAt(0).toUpperCase() + classInfo.status.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRedirectToCheckout}
            disabled={classInfo.status !== 'approved'}
            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
              classInfo.status !== 'approved'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            <FiDollarSign className="mr-2" />
            Pay & Enroll Now
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClassDetails;
