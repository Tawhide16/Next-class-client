// src/Pages/Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react';
import loginAnimation from '../../assets/LoginAnimation.json';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { signIn, loginWithGoogle } = React.useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Email/Password login
  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      toast.success('Logged in successfully 🎉', { transition: Bounce });
      navigate(location.state ? location.state : '/');
    } catch (error) {
      toast.error(error.message || 'Login failed ❌', { transition: Bounce });
    }
  };

  // ✅ Google login + Save user to DB
  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      // Backend API call to save user
      await axios.post('https://b11a12-server-side-tawhide16.vercel.app/api/users', {
        name: user.displayName || 'Unknown',
        email: user.email,
        image: user.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png',
        role: 'student',
        createdAt: new Date()
      });

      toast.success('Logged in with Google ✅', { transition: Bounce });
      navigate(location.state ? location.state : '/');
    } catch (error) {
      toast.error(error.message || 'Google login failed ❌', { transition: Bounce });
    }
  };

  // ✅ Forgot password redirect
  const handleForget = () => {
    navigate('/forgetPassword', { state: { email: watch('email') } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-10 p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
        {/* Lottie Animation */}
        <div className="w-80">
          <Lottie animationData={loginAnimation} loop={true} />
        </div>

        {/* Login Form */}
        <div className="card w-full max-w-sm shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="label text-gray-600 dark:text-gray-300">Email</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email"
                  }
                })}
                placeholder="you@example.com"
                className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="label text-gray-600 dark:text-gray-300">Password</label>
              <input
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                placeholder="••••••••"
                className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              <p
                onClick={handleForget}
                className="text-sm text-right text-blue-500 hover:underline cursor-pointer mt-1"
              >
                Forgot password?
              </p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              Login
            </button>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn w-full flex items-center justify-center gap-2 border-gray-300"
            >
              <FcGoogle size={20} /> Sign in with Google
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
              Don't have an account?
              <Link to="/register" className="ml-1 text-purple-600 dark:text-purple-400 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
