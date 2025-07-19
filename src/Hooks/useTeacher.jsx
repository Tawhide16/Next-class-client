import { useQuery } from '@tanstack/react-query';
import useAxios from './UseAxios';


const useTeacher = (email) => {
  const axios = useAxios();

  const { data: isTeacher = false, isLoading } = useQuery({
    queryKey: ['isTeacher', email],
    queryFn: async () => {
      const res = await axios.get(`/api/users/teacher/${email}`);
      return res.data?.teacher || false;
    },
    enabled: !!email, // query will only run if email exists
  });

  return [isTeacher, isLoading];
};

export default useTeacher;
