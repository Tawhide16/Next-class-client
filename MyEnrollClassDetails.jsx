import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './src/Provider/AuthProvider';
import useAxios from './src/Hooks/UseAxios';
import Swal from 'sweetalert2';
import ReactStars from "react-rating-stars-component";
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';


const MyEnrollments = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxios();

  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [showTERModal, setShowTERModal] = useState(false);
  const [terDescription, setTerDescription] = useState("");
  const [terRating, setTerRating] = useState(0);

  useEffect(() => {
    if (!user?.email) return;

    const fetchEnrollments = async () => {
      try {
        const res = await axiosSecure.get(`/api/my-enrollments?studentEmail=${user.email}`);
        setEnrolledClasses(res.data);
      } catch {
        Swal.fire('Oops!', 'Failed to load enrollments.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user?.email, axiosSecure]);

  const handleContinue = async (classId) => {
    try {
      setSelectedClassId(classId);
      const res = await axiosSecure.get(`/api/assignments?classId=${classId}`);
      setAssignments(res.data);
    } catch {
      Swal.fire('Error', 'Could not load assignments.', 'error');
    }
  };

  const handleSubmit = async (assignmentId) => {
    const text = submissions[assignmentId];
    if (!text || text.trim() === '') {
      return Swal.fire('Warning', 'Please enter your answer.', 'warning');
    }

    try {
      await axiosSecure.post('/api/submit-assignment', {
        assignmentId,
        classId: selectedClassId,
        studentEmail: user?.email,
        submissionText: text,
        submittedAt: new Date().toISOString(),
      });

      await axiosSecure.patch(`/api/assignments/increment-submission/${assignmentId}`);

      Swal.fire('Success', 'Assignment submitted successfully!', 'success');
      setSubmissions((prev) => ({ ...prev, [assignmentId]: '' }));
    } catch {
      Swal.fire('Error', 'Failed to submit assignment.', 'error');
    }
  };

  const handleTERSubmit = async () => {
    if (!terDescription.trim() || terRating === 0) {
      return Swal.fire('Oops', 'Please provide both rating and feedback!', 'warning');
    }

    try {
      await axiosSecure.post('/api/feedback', {
        studentEmail: user?.email,
        classId: selectedClassId,
        description: terDescription.trim(),
        rating: terRating,
        createdAt: new Date().toISOString(),
      });
      Swal.fire('Success!', 'Feedback submitted successfully.', 'success');
      setShowTERModal(false);
      setTerDescription("");
      setTerRating(0);
    } catch {
      Swal.fire('Error', 'Failed to submit feedback.', 'error');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading your classes...</p>;

  if (selectedClassId) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-15">
        <div className="flex justify-end mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            onClick={() => setShowTERModal(true)}
          >
            Teaching Evaluation Report (TER)
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">No assignments available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded shadow bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 border-b">Title</th>
                  <th className="py-3 px-4 border-b">Description</th>
                  <th className="py-3 px-4 border-b">Deadline</th>
                  <th className="py-3 px-4 border-b">Your Answer</th>
                  <th className="py-3 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a._id} className="text-center border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-4">{a.title}</td>
                    <td className="py-2 px-4">{a.description}</td>
                    <td className="py-2 px-4">{new Date(a.deadline).toLocaleDateString()}</td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        className="border dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-900 text-black dark:text-white rounded"
                        placeholder="Write your answer"
                        value={submissions[a._id] || ''}
                        onChange={(e) =>
                          setSubmissions((prev) => ({
                            ...prev,
                            [a._id]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleSubmit(a._id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TER Modal */}
        {showTERModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex justify-center items-center">
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Teaching Evaluation Report
      </h3>

      <textarea
        value={terDescription}
        onChange={(e) => setTerDescription(e.target.value)}
        placeholder="Write your feedback..."
        className="textarea textarea-bordered w-full mb-4 dark:bg-gray-800 dark:text-white"
      />

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 dark:text-gray-300">Your Rating:</label>
        <Rating
          style={{ maxWidth: 180 }}
          value={terRating}
          onChange={setTerRating}
          items={5}
        />
        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Rating: {terRating} ⭐</p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowTERModal(false)}
          className="btn btn-outline px-4 py-2 border border-gray-400 dark:border-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleTERSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  </div>
)}



      </div>
    );
  }

  if (enrolledClasses.length === 0)
    return <p className="text-center mt-10">You have not enrolled in any classes yet.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {enrolledClasses.map(({ _id, title, teacherName, image, classId }) => (
        <div
          key={_id}
          className="border rounded shadow hover:shadow-lg transition p-4 flex flex-col bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <img
            src={image}
            alt={title}
            className="h-40 object-cover rounded mb-3"
            loading="lazy"
          />
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">By: {teacherName}</p>
          <button
            onClick={() => handleContinue(classId)}
            className="mt-auto bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Continue
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyEnrollments;
