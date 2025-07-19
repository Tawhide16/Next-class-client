import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Provider/AuthProvider';
import useAxios from '../../Hooks/UseAxios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye, FiLoader } from 'react-icons/fi';

const MyClasses = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchClasses = async () => {
      try {
        const res = await axiosSecure.get('/api/classes', {
          params: { email: user.email }
        });
        setClasses(res.data);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load classes',
          text: 'Please try again later',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user?.email, axiosSecure]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Class?',
      html: `
        <div class="text-center">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900">This action cannot be undone</h3>
          <p class="text-gray-500 mt-2">All class data will be permanently removed</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(id);
        await axiosSecure.delete(`/api/classes/${id}`);
        setClasses((prev) => prev.filter((cls) => cls._id !== id));

        await Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Class deleted successfully',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err.response?.data?.message || 'Please try again',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          My Classes
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Manage all your teaching classes in one place
        </p>
      </div>

      {classes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No classes yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Get started by creating your first class
          </p>
          <div className="mt-6">
            <Link
              onClick={() => navigate('/dashboard/addClass')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Class
            </Link>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 w-full">
                  <img
                    src={cls.image}
                    alt={cls.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : cls.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                      {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {cls.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {cls.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>${cls.price.toFixed(2)}</p>
                    </div>
                    <div className="text-sm">
                      {/* <p className="text-gray-500 dark:text-gray-400">
                        Enrolled: <span className="font-medium">{cls.totalEnrolled || 0}</span>
                      </p> */}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => navigate(`/dashboard/my-class/${cls._id}`)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(cls._id)}
                      disabled={deletingId === cls._id}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
                    >
                      {deletingId === cls._id ? (
                        <FiLoader className="animate-spin w-4 h-4" />
                      ) : (
                        <FiTrash2 className="w-4 h-4" />
                      )}
                      <span>Delete</span>
                    </button>

                    <button
                      onClick={() => navigate(`/dashboard/my-class-details/${cls._id}`)}
                      disabled={cls.status !== 'approved'}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${cls.status === 'approved'
                          ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <FiEye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default MyClasses;