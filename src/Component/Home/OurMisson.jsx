import { motion } from 'framer-motion';
import { FaBullseye, FaRocket, FaLightbulb, FaGraduationCap } from 'react-icons/fa';

const OurMission = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  const missionItems = [
    {
      icon: <FaBullseye className="text-3xl text-blue-500" />,
      title: "Precision Learning",
      description: "Tailored educational paths for every student"
    },
    {
      icon: <FaGraduationCap className="text-3xl text-purple-500" />,
      title: "Educator Empowerment",
      description: "Tools that make teaching more effective"
    },
    {
      icon: <FaLightbulb className="text-3xl text-yellow-500" />,
      title: "Innovation",
      description: "Cutting-edge learning technologies"
    },
    {
      icon: <FaRocket className="text-3xl text-red-500" />,
      title: "Growth",
      description: "Scalable solutions for institutions"
    }
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={container}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="relative py-15 my-15 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <motion.div 
            variants={scaleIn}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FaBullseye className="text-3xl text-blue-500 dark:text-blue-400" />
            </div>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Our Core Mission
            </span>
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            At <span className="font-semibold text-blue-500 dark:text-blue-400">EduManage</span>, we're revolutionizing education through technology that empowers both students and educators to achieve their full potential.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {missionItems.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg dark:shadow-none border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
            >
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1 }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaRocket className="text-xl" />
            Join Our Mission
            <FaRocket className="ml-2 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OurMission;