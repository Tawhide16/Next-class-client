import React from 'react';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { Link } from 'react-router';

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: 'easeOut'
    }
  }
};

const JoinAsTeacher = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-gray-50 to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 py-16 overflow-hidden transition-colors duration-300 rounded-2xl">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">

        
        <motion.div
          className="w-full lg:w-1/2 relative"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }} z
        >
          <div className="rounded-xl overflow-hidden shadow-2xl dark:shadow-none border border-gray-200 dark:border-gray-600">
            <img
              src="https://i.ibb.co/Q7nCvh2f/why-a-pgce-is-the-perfect-pathway-to-becoming-a-teacher-who-makes-a-difference-sacap.jpg"
              alt="Inspiring teacher"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900 rounded-2xl opacity-20 -z-10"></div>
        </motion.div>

        {/* Right content */}
        <motion.div
          className="w-full lg:w-1/2 text-center lg:text-left"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white leading-tight">
            Share Your Knowledge, <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-400">Inspire The Next Generation</span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Join our platform and empower thousands of students by teaching what you love.
            Whether you're into coding, design, or physics — we welcome all passionate educators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/teacher">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaChalkboardTeacher className="text-xl" />
                Become a Teacher
              </motion.button>
            </Link>

            
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinAsTeacher;