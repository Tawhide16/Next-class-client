import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            About <span className="text-blue-600 dark:text-blue-400">Us</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-3xl mx-auto relative"
          >
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Welcome to <span className="font-semibold text-blue-600 dark:text-blue-400">Our Platform</span> — 
              where learning meets innovation! We're revolutionizing education with cutting-edge technology 
              and intuitive design.
            </p>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-blue-500 dark:bg-blue-400 rounded-full opacity-70"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Our Mission",
              icon: "🎯",
              desc: "To democratize education through technology, making learning accessible to everyone, everywhere.",
              bg: "bg-blue-50 dark:bg-gray-800",
            },
            {
              title: "Our Vision",
              icon: "🔭",
              desc: "A world where technology removes barriers to education, enabling lifelong learning for all.",
              bg: "bg-purple-50 dark:bg-gray-800",
            },
            {
              title: "Our Values",
              icon: "❤️",
              desc: "Innovation, Integrity, Inclusivity - the three pillars that guide everything we do.",
              bg: "bg-green-50 dark:bg-gray-800",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.2 + index * 0.1, 
                duration: 0.6, 
                type: "spring", 
                stiffness: 100 
              }}
              className={`${item.bg} rounded-xl shadow-lg dark:shadow-gray-700/30 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
              We combine cutting-edge technology with pedagogical expertise to create solutions that actually work in real classrooms.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "✓ 100,000+ active users",
                "✓ 24/7 dedicated support",
                "✓ Accessibility-first design",
                "✓ Regular feature updates"
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">{item.split('✓')[0]}</span>
                  <span className="text-gray-700 dark:text-gray-300">{item.split('✓')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;