import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../Provider/AuthProvider';
import useUserInfo from '../Hooks/useUserInfo';
import { FaUser, FaEnvelope, FaUserTie, FaSpinner } from 'react-icons/fa';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const {
    data: dbUser = {},
    isLoading,
    refetch
  } = useUserInfo(email);

  // Auto refetch if email changes
  useEffect(() => {
    if (email) {
      refetch();
    }
  }, [email, refetch]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-300" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-800 overflow-hidden p-6 border border-gray-200 dark:border-gray-700 mt-25 my-10"
    >
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-6"
        >
          <img
            src={dbUser.photoUrl || 'https://i.ibb.co/4pDNDk1/avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 dark:border-blue-500"
          />
        </motion.div>

        <div className="w-full space-y-4">
          {/* Name */}
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <FaUser className="text-blue-500 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-800 dark:text-white">{dbUser.name || 'N/A'}</p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <FaEnvelope className="text-blue-500 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-800 dark:text-white">{dbUser.email || 'N/A'}</p>
            </div>
          </motion.div>

          {/* Role */}
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <FaUserTie className="text-blue-500 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <p className="font-medium capitalize text-gray-800 dark:text-white">{dbUser.role || 'user'}</p>
            </div>
          </motion.div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => refetch()}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Refresh Profile
        </button>
      </div>
    </motion.div>
  );
};

export default MyProfile;
