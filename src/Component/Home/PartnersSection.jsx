import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const fetchPartners = async () => {
  const res = await fetch('/partners.json');
  if (!res.ok) throw new Error('Failed to fetch partners 😢');
  return res.json();
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const PartnersSection = () => {
  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: fetchPartners
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="text-lg font-medium text-gray-500 dark:text-gray-300"
        >
          Loading partners...
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-20"
      >
        <motion.p
          animate={{
            x: [0, -10, 10, -10, 0],
            color: ['#ef4444', '#dc2626', '#b91c1c']
          }}
          transition={{
            repeat: 3,
            duration: 0.5
          }}
          className="text-red-600 dark:text-red-400"
        >
          Failed to load partners 😭
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-15"
    >
      <div className="mx-auto text-center">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800 dark:text-white"
        >
          <motion.span
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            
          </motion.span> Our Partners
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          We're proud to collaborate with global leaders to create better learning ecosystems.
        </motion.p>

        <motion.div 
          className="flex overflow-x-auto pb-6 px-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
              }}
              className="flex-shrink-0 p-6  cursor-pointer w-65"
            >
              <motion.div className="flex items-center gap-8">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src={partner.logo}
                    alt={partner.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      delay: index * 0.05
                    }}
                    className="w-20 h-20 object-contain dark:filter dark:brightness-0 dark:invert"
                  />
                </motion.div>
                
                <div className="text-left">
                  <motion.h3 
                    whileHover={{ color: "#3B82F6" }}
                    className="text-xl font-semibold text-gray-800 dark:text-white"
                  >
                    {partner.name}
                  </motion.h3>
                  
                  <motion.p 
                    whileHover={{ scale: 1.02 }}
                    className="text-gray-600 dark:text-gray-400 text-sm mt-2"
                  >
                    {partner.description}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PartnersSection;