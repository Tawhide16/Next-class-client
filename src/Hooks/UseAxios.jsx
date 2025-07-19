import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { useEffect } from "react";

// ✅ Axios instance setup
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

const useAxios = () => {
  const { user, LogOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request Interceptor
    const reqInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          console.log("✅ Token added:", config.headers.Authorization);
        } else {
          console.warn("⚠️ No token found in user context");
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        if (status === 401) {
          console.warn("❌ Unauthorized! Logging out...");
          try {
            await LogOut();
            navigate("/login");
          } catch (err) {
            console.error("Logout Error:", err);
          }
        } else if (status === 403) {
          console.warn("🚫 Forbidden request");
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount or dependency change
    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [user, LogOut, navigate]);

  return axiosInstance;
};

export default useAxios;
