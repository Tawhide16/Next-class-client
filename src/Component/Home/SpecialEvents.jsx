import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const SpecialEvents = () => {
  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit",
      date: "20 August 2025",
      location: "Dhaka, Bangladesh",
      image: "https://i.ibb.co.com/TqJJKhFL/Global-Tech-Innovation-Summit-2023.jpg",
    },
    {
      id: 2,
      title: "Creative Design Workshop",
      date: "25 August 2025",
      location: "Chattogram, Bangladesh",
      image: "https://i.ibb.co.com/5WgX3FpX/Screen-shot-2012-10-18-at-8-37-35-PM.webp",
    },
    {
      id: 3,
      title: "AI & Machine Learning Meetup",
      date: "30 August 2025",
      location: "Sylhet, Bangladesh",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Toast handler
  const handleLearnMore = (title) => {
    toast.success(`More details about "${title}" coming soon!`, {
      duration: 3000,
      position: "top-right",
    });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16 px-6 my-10 rounded-2xl">
      <Toaster /> 

      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Special Events
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12"
        >
          Join our exclusive events designed to inspire, educate, and connect
          learners with experts from around the world.
        </motion.p>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.2, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-4">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  {event.location}
                </div>
                <button
                  onClick={() => handleLearnMore(event.title)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialEvents;
