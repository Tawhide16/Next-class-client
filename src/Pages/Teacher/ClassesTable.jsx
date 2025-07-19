import React, { useEffect, useState } from 'react';
import useAxios from '../../Hooks/UseAxios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiLoader, FiClock } from 'react-icons/fi';

const ClassesTable = () => {
  const axiosSecure = useAxios();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosSecure.get('/api/classes/all');
        setClasses(res.data);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch classes',
          text: err.response?.data?.message || 'Please try again later',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [axiosSecure]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await axiosSecure.patch(`/api/classes/${id}`, { status });
      
      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Class ${status}`,
        showConfirmButton: false,
        timer: 1500
      });

      setClasses(prev =>
        prev.map(cls => (cls._id === id ? { ...cls, status } : cls))
      );
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Please try again',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClasses = classes.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
    <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {currentClasses.map((cls) => (
                <motion.tr
                  key={cls._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-16">
                        <img
                          className="h-12 w-16 rounded-md object-cover"
                          src={cls.image}
                          alt={cls.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {cls.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ${cls.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{cls.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {cls.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white line-clamp-2 max-w-xs">
                      {cls.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cls.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : cls.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {cls.status === 'approved' && <FiCheck className="mr-1 inline" />}
                      {cls.status === 'rejected' && <FiX className="mr-1 inline" />}
                      {cls.status === 'pending' && <FiClock className="mr-1 inline" />}
                      {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(cls._id, 'approved')}
                        disabled={updatingId === cls._id || cls.status === 'approved'}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                          cls.status === 'approved'
                            ? 'bg-green-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        }`}
                      >
                        {updatingId === cls._id && cls.status === 'pending' ? (
                          <FiLoader className="animate-spin mr-1" />
                        ) : (
                          <FiCheck className="mr-1" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(cls._id, 'rejected')}
                        disabled={updatingId === cls._id || cls.status === 'rejected'}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                          cls.status === 'rejected'
                            ? 'bg-red-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        }`}
                      >
                        {updatingId === cls._id && cls.status === 'pending' ? (
                          <FiLoader className="animate-spin mr-1" />
                        ) : (
                          <FiX className="mr-1" />
                        )}
                        Reject
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center p-4 space-x-2 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClassesTable;
