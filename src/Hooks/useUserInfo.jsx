// src/hooks/useUserInfo.js
import { useQuery } from '@tanstack/react-query';
import useAxios from './UseAxios';



const useUserInfo = (email) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ['userInfo', email],
    enabled: !!email,  // Run query only if email exists
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/users/${email}`);
      return res.data;
    },
  });
};

export default useUserInfo;
