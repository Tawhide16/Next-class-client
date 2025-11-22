// src/Pages/Payment/StripeCheckoutPage.jsx
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../Hooks/UseAxios';
import { AuthContext } from '../../Provider/AuthProvider';
import CheckoutForm from './CheckoutForm';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeCheckoutPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useContext(AuthContext);

  const { data: classInfo, isLoading, isError } = useQuery({
    queryKey: ['class-details', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/classes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (isError || !classInfo) {
    return (
      <div className="text-center py-16">
        <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800">Failed to load class info</h3>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-auto mt-20">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Complete Payment for: <span className="text-indigo-600">{classInfo.title}</span>
        </h2>

        {/* ✅ Must wrap in <Elements> */}
        <Elements stripe={stripePromise}>
          <CheckoutForm classInfo={classInfo} user={user} />
        </Elements>
      </div>
    </div>
  );
};

export default StripeCheckoutPage;
