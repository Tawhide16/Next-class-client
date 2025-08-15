import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../Hooks/UseAxios';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const fetchApprovedClasses = async (axiosSecure, page, limit) => {
  const res = await axiosSecure.get(`/api/classes/approved?page=${page}&limit=${limit}`);
  return res.data;
};

const AllClassDetails = () => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalEnrolledMap, setTotalEnrolledMap] = useState({});
  const [sort, setSort] = useState(null); // null, 'asc', or 'desc'

  const {
    data: originalData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['approved-classes', page],
    queryFn: () => fetchApprovedClasses(axiosSecure, page, limit),
    keepPreviousData: true,
  });

  // Sort the data client-side
  const sortedData = useMemo(() => {
    if (!originalData?.data) return [];
    
    return [...originalData.data].sort((a, b) => {
      if (sort === 'asc') return a.price - b.price;
      if (sort === 'desc') return b.price - a.price;
      return 0; // No sorting
    });
  }, [originalData, sort]);

  // Update total pages when data arrives
  useEffect(() => {
    if (originalData?.totalPages) {
      setTotalPages(originalData.totalPages);
    }
  }, [originalData]);

  // Fetch enrollment counts for the current page's classes
  useEffect(() => {
    const fetchTotalEnrollmentsForAll = async () => {
      try {
        const updatedMap = {};
        for (const cls of sortedData) {
          const res = await axiosSecure.get(`/api/enrollments/count/${cls._id}`);
          updatedMap[cls._id] = res.data.count || 0;
        }
        setTotalEnrolledMap(updatedMap);
      } catch (err) {
        console.error("Error fetching total enrolled for all classes:", err);
      }
    };
    if (sortedData.length > 0) {
      fetchTotalEnrollmentsForAll();
    }
  }, [sortedData, axiosSecure]);

  const handleEnroll = (cls) => {
    navigate(`/class/${cls._id}/details`);
  };

  const handleSort = (sortType) => {
    // Toggle if clicking the same sort button
    if (sort === sortType) {
      setSort(null);
    } else {
      setSort(sortType);
    }
  };

  if (isLoading) return <p className="text-center text-xl">Loading...</p>;
  if (isError) return <p className="text-center text-red-600">Failed to load classes.</p>;

  return (
    <div className="mx-auto px-15 py-8 mt-15 my-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
        All Classes
      </h1>
      
      {/* Sorting Controls */}
      <div className="flex justify-end mb-6 gap-4">
        <button
          onClick={() => handleSort('asc')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${
            sort === 'asc' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
          }`}
        >
          <FiArrowUp /> Price: Low to High
        </button>
        <button
          onClick={() => handleSort('desc')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${
            sort === 'desc' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
          }`}
        >
          <FiArrowDown /> Price: High to Low
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedData.map((cls) => (
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