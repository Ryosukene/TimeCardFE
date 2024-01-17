import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { ClockInTime } from '../types'
export const usePostClockInTime = () => {
  const postClockInTime = async (clockInTimeData: ClockInTime) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/attendance-records/clock-in`, 
      clockInTimeData,
      { withCredentials: true }
    );
    return response.data;
  };
  return useMutation(postClockInTime, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
        console.log(error);
    },
  });
};