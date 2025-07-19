// src/hooks/useAdmin.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useAdmin = (email) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (email) {
      axios.get(`https://b11a12-server-side-tawhide16.vercel.app/api/users/admin/${email}`)
        .then(res => {
          setIsAdmin(res.data.admin);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [email]);

  return [isAdmin, isLoading];
};

export default useAdmin;
