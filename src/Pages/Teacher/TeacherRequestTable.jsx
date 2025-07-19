import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TeacherRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        'https://b11a12-server-side-tawhide16.vercel.app/api/teachers'
      );
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching teacher requests:', err);
    }
  };

  const handleApprove = async (teacher) => {
    try {
      await axios.patch(
        `https://b11a12-server-side-tawhide16.vercel.app/api/teachers/${teacher._id}`,
        { status: 'accepted' }
      );

      await axios.patch(
        `https://b11a12-server-side-tawhide16.vercel.app/api/users/role/${teacher.email}`,
        { role: 'teacher' }
      );

      fetchRequests();

      Swal.fire({
        icon: 'success',
        title: 'Approved!',
        text: `${teacher.name} is now a teacher.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Failed to approve',
      });
    }
  };

  const handleReject = async (teacher) => {
    try {
      await axios.patch(
        `https://b11a12-server-side-tawhide16.vercel.app/api/teachers/${teacher._id}`,
        { status: 'rejected' }
      );

      fetchRequests();

      Swal.fire({
        icon: 'warning',
        title: 'Rejected!',
        text: `${teacher.name}'s request has been rejected.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Failed to reject',
      });
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = requests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="overflow-x-auto max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Teacher Requests
      </h2>

      <table className="w-full table-auto border-collapse shadow-md bg-white dark:bg-gray-900">
        <thead className="bg-gray-200 dark:bg-gray-700 text-left">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Experience</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((teacher) => {
            const isRejected = teacher.status === 'rejected';
            const isAccepted = teacher.status === 'accepted';

            return (
              <tr key={teacher._id} className="border-b dark:border-gray-700">
                <td className="p-3">
                  <img
                    src={teacher.image}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                </td>
                <td className="p-3">{teacher.name}</td>
                <td className="p-3 capitalize">{teacher.experience}</td>
                <td className="p-3">{teacher.title}</td>
                <td className="p-3">{teacher.category}</td>
                <td
                  className={`p-3 font-semibold ${
                    isRejected
                      ? 'text-red-500'
                      : isAccepted
                      ? 'text-green-600'
                      : 'text-yellow-500'
                  }`}
                >
                  {teacher.status}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleApprove(teacher)}
                    disabled={isRejected || isAccepted}
                    className={`px-3 py-1 rounded ${
                      isRejected || isAccepted
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(teacher)}
                    disabled={isRejected || isAccepted}
                    className={`px-3 py-1 rounded ${
                      isRejected || isAccepted
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white
                     hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white
                     hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TeacherRequestTable;
