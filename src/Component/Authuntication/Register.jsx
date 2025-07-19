import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaUpload, FaUserGraduate } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react';
import loginAnimation from '../../assets/RegisterAimation.json';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
        reset
    } = useForm({ mode: 'onChange' });

    const [showPassword, setShowPassword] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { createUser, updateUser, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const validatePassword = (value) => {
        if (value.length < 6) return 'Password should be at least 6 characters';
        if (!/[A-Z]/.test(value)) return 'Password should include a capital letter';
        if (!/[a-z]/.test(value)) return 'Password should include a small letter';
        return true;
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=aaf50483785ad23261d3f9a4759c7518`,
                formData
            );

            if (res.data?.data?.url) {
                const uploadedUrl = res.data.data.url;
                setValue('photoUrl', uploadedUrl, { shouldValidate: true });
                setPreviewImage(uploadedUrl);
                toast.success('Image uploaded to ImgBB ✅');
            } else {
                throw new Error('No URL returned from ImgBB');
            }
        } catch (error) {
            toast.error('ImgBB image upload failed ❌');
            console.error('ImgBB error:', error);
        } finally {
            setUploading(false);
        }
    };

    const saveUserToDatabase = async (user) => {
        const saveUser = {
            name: user.displayName || 'Unknown',
            email: user.email,
            photoUrl: user.photoUrl || user.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png',
            role: 'student',
            createdAt: new Date()
        };

        try {
            await axios.post('https://b11a12-server-side-tawhide16.vercel.app/api/users', saveUser);
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('User save failed ❌');
        }
    };

    const onSubmit = async (data) => {
        try {
            const { email, password, name, photoUrl } = data;

            const userCredential = await createUser(email, password);
            const user = userCredential.user;

            await updateUser({
                displayName: name,
                photoURL: photoUrl || 'https://i.ibb.co/4pDNDk1/avatar.png'
            });

            await saveUserToDatabase({
                displayName: name,
                email,
                photoUrl
            });

            toast.success('Registered successfully ✨', { transition: Bounce });
            reset();
            setPreviewImage(null);
            navigate(location.state?.pathname || '/');
        } catch (error) {
            toast.error(error.message || 'Registration failed ❌');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await loginWithGoogle();
            const user = result.user;

            await saveUserToDatabase({
                displayName: user.displayName,
                email: user.email,
                photoUrl: user.photoURL
            });

            toast.success('Logged in with Google 🎉', { transition: Bounce });
            navigate(location.state?.pathname || '/');
        } catch (error) {
            toast.error(error.message || 'Google login failed ❌');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr bg-gray-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 px-4">
            <div className="flex flex-col lg:flex-row items-center gap-10 p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <div className="w-80">
                    <Lottie animationData={loginAnimation} loop={true} />
                </div>

                <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
                    <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6">Create Account</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: { value: 6, message: 'Name should be at least 6 characters' }
                                })}
                                type="text"
                                placeholder="Your full name"
                                className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-300" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400"><FaUserGraduate size={28} /></span>
                                    </div>
                                )}
                                <label className="flex-1">
                                    <div className="btn btn-outline w-full flex items-center justify-center gap-2">
                                        {uploading ? (
                                            <>
                                                <span className="loading loading-spinner text-primary"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload /> Upload Image
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </div>
                                </label>
                            </div>
                            <input {...register('photoUrl')} type="hidden" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                {...register('email', { required: 'Email is required' })}
                                type="email"
                                placeholder="you@example.com"
                                className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <div className="relative">
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        validate: validatePassword
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute top-2 right-3 text-gray-400"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                            {!errors.password && watch('password') && <p className="text-sm text-green-600 mt-1">Valid password ✅</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!isValid || uploading}
                            className="btn w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                            Register
                        </button>

                        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-3">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </form>

                    <div className="divider text-gray-400 dark:text-gray-500 mt-6">OR</div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="btn w-full flex items-center justify-center gap-2 border-gray-300"
                    >
                        <FcGoogle size={20} /> Sign in with Google
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
