import React, { useEffect, useState } from 'react';
import { FaUsers, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "backOut" } }
};

const lottieAnimation = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.4
    } 
  },
  float: {
    y: [-10, 10],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

const StatsOverview = () => {
  const [animationData, setAnimationData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalEnrollments: 0
  });
  const [counters, setCounters] = useState({
    users: 0,
    classes: 0,
    enrollments: 0
  });

  // Fetch animation JSON
  useEffect(() => {
    fetch('/Graduation Hat.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Animation load failed:', err));
  }, []);

  
  useEffect(() => {
    axios.get('https://b11a12-server-side-tawhide16.vercel.app/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  // Counter animation effect
  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const animateCounters = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease out

      setCounters({
        users: Math.floor(easedProgress * stats.totalUsers),
        classes: Math.floor(easedProgress * stats.totalClasses),
        enrollments: Math.floor(easedProgress * stats.totalEnrollments)
      });

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    animateCounters();
  }, [stats]);

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-10"
    >
      {/* Stats Cards */}
      <motion.div 
        variants={container}
        className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
      >
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700"
        >
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
            <FaUsers className="text-blue-600 text-5xl mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total Users</h3>
          <motion.p 
            className="text-3xl font-extrabold text-blue-500"
            key={counters.users}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {counters.users}
          </motion.p>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl hover:bg-green-50 dark:hover:bg-gray-700"
        >
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
            <FaChalkboardTeacher className="text-green-600 text-5xl mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total Classes</h3>
          <motion.p 
            className="text-3xl font-extrabold text-green-500"
            key={counters.classes}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {counters.classes}
          </motion.p>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl hover:bg-purple-50 dark:hover:bg-gray-700"
        >
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
            <FaUserGraduate className="text-purple-600 text-5xl mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Enrollments</h3>
          <motion.p 
            className="text-3xl font-extrabold text-purple-500"
            key={counters.enrollments}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {counters.enrollments}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Lottie Animation */}
      <motion.div 
        initial="hidden"
        animate={["show", "float"]}
        variants={lottieAnimation}
        className="flex-1 max-w-md lg:max-w-lg"
      >
        {animationData ? (
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
            <Lottie animationData={animationData} loop className="w-full h-full" />
          </motion.div>
        ) : (
          <motion.div
            className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 text-center"
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1, 0.98] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-gray-500 dark:text-gray-300">Loading animation...</p>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default StatsOverview;
