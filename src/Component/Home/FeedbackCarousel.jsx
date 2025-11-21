import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import useAxios from '../../Hooks/UseAxios';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

const FeedbackCarousel = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const axiosSecure = useAxios();
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axiosSecure.get('/api/feedbacks');
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      }
    };
    fetchFeedbacks();
  }, [axiosSecure]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        What Students Are Saying
      </h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No feedback available yet.</p>
      ) : (
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          modules={[Autoplay, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          navigation
        >
          {feedbacks.map((feedback, index) => (
            <SwiperSlide key={feedback._id}>
              <div
                className={`
                  transition-all duration-300 ease-in-out 
                  p-6 rounded-lg shadow-lg text-center 
                  bg-white dark:bg-gray-800
                  ${index === activeIndex ? '' : 'blur-sm opacity-50 scale-90'}
                `}
              >
                {/* Student Image */}
                <img
                  src={feedback.studentImage || 'https://i.ibb.co/4pDNDk1/avatar.png'}
                  alt={feedback.studentEmail || 'Student'}
                  className="w-16 h-16 rounded-full mx-auto mb-4 border"
                />

             
                <Rating
                  value={feedback.rating}
                  readOnly
                  style={{ maxWidth: 150, margin: '0 auto' }}
                />

                {/* Feedback Description */}
                <p className="text-gray-700 dark:text-gray-300 mt-4 text-lg italic">
                  "{feedback.description}"
                </p>

                {/* Student Email */}
                <p className="text-sm text-gray-500 mt-2">
                  — {feedback.studentEmail || 'Anonymous'}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default FeedbackCarousel;
