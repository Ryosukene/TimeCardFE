import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const useGetTimes = () => {
  return useQuery(['getTimes'], () =>
    axios.get(`${process.env.REACT_APP_API_URL}/attendance-records/`, { withCredentials: true })
      .then(response => {
        console.log("response.data", response.data);
        return response.data;
      })
  );
};
