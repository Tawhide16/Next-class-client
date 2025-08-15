import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../src/Provider/AuthProvider';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplyAsTeacher = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    image: user?.photoURL || '',
    experience: 'beginner',
    title: '',
    category: 'Web Development',
  });

  const [teacherStatus, setTeacherStatus] = useState('loading'); // Default 'loading'

  // Fetch teacher status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.email) {
        setTeacherStatus(null);
        return;
      }

      try {
        const res = await axios.get(
          `https://b11a12-server-side-tawhide16.vercel.app/api/teachers/status/${user.email}`
        );
        setTeacherStatus(res.data.status || null); // Example: "accepted", "pending", or null
      } catch (err) {
        console.error('Error fetching teacher status:', err);
        setTeacherStatus(null);
      }
    };

    fetchStatus();
  }, [user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teacherData = {
      ...formData,
      status: 'pending',
    };

    try {
      const res = await axios.post(
        'https://b11a12-server-side-tawhide16.vercel.app/api/teachers',
        teacherData
      );
      console.log(res.data);

      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'Your application is under review. We will get back to you soon.',
        confirmButtonColor: '#3085d6',
      });

      setFormData((prev) => ({
        ...prev,
        title: '',
        experience: 'beginner',
        category: 'Web Development',
      }));

      setTeacherStatus('pending');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong 🥲', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 md:p-10 bg-white dark:bg-gray-900 shadow-xl rounded-xl mt-25 my-10 transition-all duration-300">
      <ToastContainer />

      <div className="flex justify-center mb-6">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-500 dark:border-blue-400 overflow-hidden shadow-md">
          <img
            src={formData.image}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Become a Teacher
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          readOnly
          className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="w-full p-3 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
        />

        <input
          type="text"
          name="title"
          placeholder="Your Title (e.g. MERN Stack Instructor)"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="beginner">Beginner</option>
          <option value="mid-level">Mid-Level</option>
          <option value="experienced">Experienced</option>
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="Web Development">Web Development</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Data Science">Data Science</option>
          <option value="Cyber Security">Cyber Security</option>
        </select>

        {/* Conditionally render button or message */}
        {teacherStatus === 'accepted' ? (
          <p className="text-green-600 text-center font-semibold">
            You're already a teacher.
          </p>
        ) : (
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 shadow-md disabled:opacity-60"
            disabled={teacherStatus === 'pending' || teacherStatus === 'loading'}
          >
            {teacherStatus === 'pending'
              ? 'Application Under Review'
              : teacherStatus === 'loading'
              ? 'Loading...'
              : 'Submit'}
          </button>
        )}
      </form>
    </div>
  );
};

export default ApplyAsTeacher;
