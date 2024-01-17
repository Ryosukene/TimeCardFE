import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const useAuthGetTable = (date:any, department:string) => {
    return useQuery(['getTimes', date, department], () =>
      axios.get(`${process.env.REACT_APP_API_URL}/adminrecords/date-department`, {
        params: {
          date: date,
          department: department
        },
        withCredentials: true
      })
      .then(response => {
        console.log("useAuthGetTable:response.data", response.data);
        return response.data;
      })
    );
  };
  