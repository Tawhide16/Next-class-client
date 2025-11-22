import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxios from "../../Hooks/UseAxios";

const PaymentHistory = () => {
  const axios = useAxios();
  const { user } = useContext(AuthContext);

 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: history = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/enrollments/history/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-300"></div>
        <span className="ml-3 text-gray-700 dark:text-gray-200">Loading payment history...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-red-700 dark:text-red-300">
        <p>Error: {error.message || "Failed to load payment history."}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-700/50 hover:bg-red-200 dark:hover:bg-red-700 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = history.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Payment History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Details of all your transactions</p>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No payment history found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Your transactions will show up here once completed.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {currentData.map((item) => (
                  <tr key={item.transactionId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 rounded-md object-cover mr-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40?text=No+Image";
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{item.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400 font-medium">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 dark:text-blue-400 font-mono text-sm">
                      {item.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {new Date(item.enrolledAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                        Successful
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
