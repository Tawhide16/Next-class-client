import React, { useEffect, useState } from 'react';
import useAxios from '../../Hooks/UseAxios';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TopEnrolledClasses = () => {
  const axiosSecure = useAxios();
  const [topClasses, setTopClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopEnrolled = async () => {
      try {
        const res = await axiosSecure.get('/api/classes/approved');

        // 🧠 Defensive check for proper array
        const approvedClasses = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.classes || [];

        // 🔁 Now fetch totalEnrolled for each class
        const classesWithCount = await Promise.all(
          approvedClasses.map(async (cls) => {
            try {
              const countRes = await axiosSecure.get(`/api/enrollments/count/${cls._id}`);
              return {
                ...cls,
                totalEnrolled: countRes.data.count || 0,
              };
            } catch {
              return {
                ...cls,
                totalEnrolled: 0,
              };
            }
          })
        );

      
        const sorted = classesWithCount
          .sort((a, b) => b.totalEnrolled - a.totalEnrolled)
          .slice(0, 4);

        setTopClasses(sorted);
      } catch (err) {
        console.error('Error fetching top enrolled classes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEnrolled();
  }, [axiosSecure]);

  const handleEnroll = (clsId) => {
    navigate(`/class/${clsId}/details`);
  };

  if (loading) {
    return <p className="text-center text-lg">Loading top classes...</p>;
  }

  return (
    <div className="mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
        🔥 Most Enrolled Classes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {topClasses.map((cls, index) => (
          <motion.div
            key={cls._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 border dark:border-gray-700"
          >
            <img
              src={cls.image}
              alt={cls.title}
              className="w-full h-44 object-cover rounded-t-2xl"
            />
            <div className="p-5 space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 flex items-center gap-2">
                <FiBookOpen className="text-indigo-600" /> {cls.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {cls.description?.slice(0, 100)}...
              </p>
              <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <FiUsers className="text-green-600" />
                  {cls.totalEnrolled || 0} enrolled
                </span>
                <span className="text-indigo-600 font-semibold">${cls.price}</span>
              </div>
              <button
                onClick={() => handleEnroll(cls._id)}
                className="w-full flex items-center justify-center gap-2 mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
              >
                <FiShoppingCart /> Enroll Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopEnrolledClasses;
