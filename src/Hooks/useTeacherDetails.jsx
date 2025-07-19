import { useQuery } from "@tanstack/react-query";
import useAxios from "./UseAxios";

const useTeacherDetails = (email) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["teacherDetails", email],
    queryFn: async () => {
      if (!email) return null;
      const encodedEmail = encodeURIComponent(email);
      const res = await axios.get(`/api/users/teacher-details/${encodedEmail}`);
      return res.data;
    },
    enabled: !!email,
  });
};

export default useTeacherDetails;
