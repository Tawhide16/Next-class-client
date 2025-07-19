import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AllUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch Users
  const fetchUsers = async (searchTerm = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`https://b11a12-server-side-tawhide16.vercel.app/api/users?search=${searchTerm}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Search Handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchUsers(value);
    setCurrentPage(1);
  };

  // ✅ Make Admin
  const handleMakeAdmin = async (email) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will become an Admin!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, make Admin',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.patch(`https://b11a12-server-side-tawhide16.vercel.app/api/users/admin/${email}`);
        fetchUsers(search);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'User promoted to admin!',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to make user admin!',
        });
      }
    }
  };

  //add remove section

  // ✅ Remove Admin 
  const handleRemoveAdmin = async (email) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will lose Admin role!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove Admin',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.patch(`https://b11a12-server-side-tawhide16.vercel.app/api/users/remove-admin/${email}`);
        fetchUsers(search);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: 'Admin role removed!',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to remove admin role!',
        });
      }
    }
  };

  // ✅ Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <p className="mt-3 text-gray-700 dark:text-gray-300">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">All Users</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        value={search}
        onChange={handleSearch}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border dark:border-gray-700 text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-700">
                  <td className="p-3">
                    <img
                      src={user.photoUrl || 'https://i.ibb.co/4pDNDk1/avatar.png'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role || 'user'}</td>
                  <td className="p-3 flex gap-2">
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => handleRemoveAdmin(user.email)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user.email)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
      {users.length > itemsPerPage && (
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
      )}
    </div>
  );
};

export default AllUsersTable;
