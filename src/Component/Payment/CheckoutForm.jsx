import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import useAxios from '../../Hooks/UseAxios';
import { useNavigate } from 'react-router';


const CheckoutForm = ({ classInfo, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxios();
   const navigate = useNavigate(); // 🧭 init

  const {
    title,
    price,
    name: teacherName,
    email: teacherEmail,
    _id: classId,
    image,
  } = classInfo;

  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Check if already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user?.email || !classId) return;

      try {
        const res = await axiosSecure.get(
          `/api/enrollments?studentEmail=${user.email}&classId=${classId}`
        );

        const data = res.data;
        if (data.length > 0 && data[0].paymentStatus === 'paid') {
          setIsPaid(true);
        } else {
          setIsPaid(false);
        }
      } catch (err) {
        console.error('Enrollment check failed:', err.message);
      }
    };

    checkEnrollment();
  }, [user?.email, classId, axiosSecure]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (isPaid) {
      Swal.fire('Info', 'You already paid for this class.', 'info');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Get Payment Intent
      const { data } = await axiosSecure.post('/api/create-payment-intent', {
        price,
      });

      // Step 2: Confirm Card Payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName || 'Anonymous',
            email: user?.email,
          },
        },
      });

      if (result.error) {
        Swal.fire('Error', result.error.message, 'error');
      } else if (result.paymentIntent.status === 'succeeded') {
        // Step 3: Save to Enrollments DB
        const enrollData = {
          studentName: user?.displayName,
          studentEmail: user?.email,
          classId,
          title,
          price,
          teacherName,
          teacherEmail,
          image,
          transactionId: result.paymentIntent.id,
          paymentStatus: 'paid',
          enrolledAt: new Date().toISOString(),
        };

        await axiosSecure.post('/api/enroll', enrollData);
        Swal.fire('Success!', 'You are enrolled!', 'success');
        setIsPaid(true);

        navigate(`/dashboard/my-enroll`);
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Payment failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 ">
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || isPaid || loading}
        className={`w-full text-white py-2 rounded ${
          isPaid
            ? 'bg-green-500 cursor-not-allowed'
            : loading
            ? 'bg-indigo-400 cursor-wait'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isPaid ? 'Payment Completed ✅' : loading ? 'Processing...' : `Pay $${price}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
