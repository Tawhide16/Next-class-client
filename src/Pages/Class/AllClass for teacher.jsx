import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../Hooks/UseAxios';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';

// Now accepts page and limit for pagination
const fetchApprovedClasses = async (axiosSecure, page, limit) => {
  const res = await axiosSecure.get(`/api/classes/approved?page=${page}&limit=${limit}`);
  return res.data;
};

const AllClassDetails = () => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10; // how many classes per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalEnrolledMap, setTotalEnrolledMap] = useState({});

  // React Query with page dependency so it refetches when page changes
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['approved-classes', page],
    queryFn: () => fetchApprovedClasses(axiosSecure, page, limit),
    keepPreviousData: true, // smooth UI when switching pages
  });

  // Update total pages when data arrives
  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  // Fetch enrollment counts for the current page's classes
  useEffect(() => {
    const fetchTotalEnrollmentsForAll = async () => {
      try {
        const updatedMap = {};
        for (const cls of data?.data || []) {
          const res = await axiosSecure.get(`/api/enrollments/count/${cls._id}`);
          updatedMap[cls._id] = res.data.count || 0;
        }
        setTotalEnrolledMap(updatedMap);
      } catch (err) {
        console.error("Error fetching total enrolled for all classes:", err);
      }
    };
    if (data?.data?.length > 0) {
      fetchTotalEnrollmentsForAll();
    }
  }, [data, axiosSecure]);

  // Refetch on tab focus
  useEffect(() => {
    const handleFocus = () => refetch();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  const handleEnroll = (cls) => {
    navigate(`/class/${cls._id}/details`);
  };

  if (isLoading) return <p className="text-center text-xl">Loading...</p>;
  if (isError) return <p className="text-center text-red-600">Failed to load classes.</p>;

  return (
    <div className=" mx-auto px-15 py-8 mt-15 my-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
        All Approved Classes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6">
        {(data?.data || []).map((cls) => (
          <motion.div
            key={cls._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={cls.image}
              alt={cls.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                {cls.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {cls.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Posted By:</strong> {cls.name} <br />
                <strong>Email:</strong> {cls.email}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Price: ${cls.price}
              </p>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Enrolled: {totalEnrolledMap[cls._id] || 0} students
              </p>
              <button
                onClick={() => handleEnroll(cls)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                <FiShoppingCart className="w-4 h-4" /> Enroll Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md font-semibold ${
            page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md font-semibold ${
            page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllClassDetails;
