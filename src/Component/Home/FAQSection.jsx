import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle, FaLightbulb, FaBookOpen, FaUsers } from 'react-icons/fa';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I get started with the platform?",
      answer: "Getting started is easy! Simply create an account, complete your profile, and explore our interactive dashboard. We offer guided tutorials to help you navigate all features.",
      icon: <FaQuestionCircle className="text-blue-500" />
    },
    {
      question: "What teaching resources are available?",
      answer: "We provide lesson planners, interactive whiteboards, assignment templates, and a rich library of educational content. Plus, our AI assistant helps create customized materials.",
      icon: <FaBookOpen className="text-purple-500" />
    },
    {
      question: "Can I collaborate with other educators?",
      answer: "Absolutely! Our platform features team teaching tools, shared workspaces, and community forums where educators can share best practices and co-create content.",
      icon: <FaUsers className="text-green-500" />
    },
    {
      question: "How does the pricing work?",
      answer: "We offer free basic access with premium plans starting at $9.99/month. Institutional pricing is available for schools and universities with custom solutions.",
      icon: <FaLightbulb className="text-yellow-500" />
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.8 }}
      className="py-15 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <FaQuestionCircle className="text-3xl text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Frequently Asked <span className="text-blue-500 dark:text-blue-400">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about our platform. Can't find an answer? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          className="max-w-3xl mx-auto space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }
              }}
              className="overflow-hidden"
            >
              <motion.div
                onClick={() => toggleFAQ(index)}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer p-6 rounded-xl shadow-md dark:shadow-none transition-all duration-300 ${activeIndex === index ? 'bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700' : 'bg-white/80 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900/70 rounded-b-2xl'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {faq.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <FaChevronDown />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pl-12">
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
        </motion.div>
      </div>
    </motion.section>
  );
};



export default FAQSection;