import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/UseAxios";
import axios from "axios";

const IMG_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const ClassDetailsForTeacher = ({ stats = {} }) => {
  const { id: classId } = useParams();

  const [totalEnrolled, setTotalEnrolled] = useState(0);
  const [assignmentsCount, setAssignmentsCount] = useState(stats.totalAssignments || 0);
  const [totalSubmissions, setTotalSubmissions] = useState(stats.totalSubmissions || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxios();

  const fetchSubmittedAssignments = async () => {
    if (!classId) return;
    try {
      setLoadingSubmissions(true);
      const res = await axiosSecure.get(`/api/assignments/submitted/${classId}`);
      setSubmittedAssignments(res.data);
    } catch (error) {
      console.error("Failed to fetch submitted assignments", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const fetchAssignments = async () => {
    if (!classId) return;
    try {
      const res = await axiosSecure.get(`/api/assignments/count/${classId}`);
      setAssignmentsCount(res.data.count);
    } catch (error) {
      console.error("Failed to fetch assignments count", error);
    }
  };

  const fetchTotalEnrolled = async () => {
    if (!classId) return;
    try {
      const res = await axiosSecure.get(`/api/enrollments/count/${classId}`);
      setTotalEnrolled(res.data.count || 0);
    } catch (error) {
      console.error("Failed to fetch total enrolled count", error);
    }
  };

  const fetchTotalSubmissions = async () => {
    if (!classId) return;
    try {
      const res = await axiosSecure.get(`/api/assignments/submissions/count/${classId}`);
      setTotalSubmissions(res.data.totalSubmissions || 0);
    } catch (error) {
      console.error("Failed to fetch total submissions", error);
    }
  };

  // Polling to refresh submissions count and submitted assignments every 5 seconds
  useEffect(() => {
    fetchSubmittedAssignments();
    fetchAssignments();
    fetchTotalEnrolled();
    fetchTotalSubmissions();

    const interval = setInterval(() => {
      fetchSubmittedAssignments();
      fetchTotalSubmissions();
    }, 5000);

    return () => clearInterval(interval);
  }, [classId]);

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${IMG_API_KEY}`,
          formData
          
        );

        imageUrl = imgRes.data.data.url;
        
      }
      

      const assignmentData = {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        image: imageUrl,
        classId,
      };

      await axiosSecure.post("/api/assignments", assignmentData);

      setAssignmentsCount((prev) => prev + 1);
      Swal.fire("Success!", "Assignment created successfully", "success");
      reset();
      setIsModalOpen(false);

      // Refresh data immediately after adding
      fetchSubmittedAssignments();
      fetchAssignments();
      fetchTotalSubmissions();
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to create assignment", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Class Progress */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Class Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-green-600 text-4xl font-extrabold">{totalEnrolled}</div>
            <p className="mt-2 text-gray-700 dark:text-gray-300 font-semibold">Total Enrollment</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-blue-600 text-4xl font-extrabold">{assignmentsCount}</div>
            <p className="mt-2 text-gray-700 dark:text-gray-300 font-semibold">Total Assignments</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-purple-600 text-4xl font-extrabold">{totalSubmissions}</div>
            <p className="mt-2 text-gray-700 dark:text-gray-300 font-semibold">Assignment Submissions</p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Create Assignment
          </button>
        </div>
      </section>

      {/* Submitted Assignments Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Submitted Assignments</h2>
        {loadingSubmissions ? (
          <p>Loading submitted assignments...</p>
        ) : submittedAssignments.length === 0 ? (
          <p>No assignments submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submittedAssignments.map((assignment) => (
              <div
                key={assignment._id}
                className="border rounded p-4 shadow bg-white dark:bg-gray-800"
              >
                <h3 className="font-bold text-lg">{assignment.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{assignment.description}</p>
                <p className="text-sm mt-2">
                  Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                </p>
                {assignment.image && (
                  <img
                    src={assignment.image}
                    alt={assignment.title}
                    className="mt-2 rounded max-h-48 object-cover"
                  />
                )}
                <p className="mt-2 text-green-600 font-semibold">Submitted ✔️</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal for New Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">New Assignment</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("title")}
                type="text"
                placeholder="Assignment Title"
                required
                className="input input-bordered w-full"
              />
              <textarea
                {...register("description")}
                placeholder="Assignment Description"
                required
                className="textarea textarea-bordered w-full"
              />
              <input
                {...register("deadline")}
                type="date"
                required
                className="input input-bordered w-full"
              />
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetailsForTeacher;
