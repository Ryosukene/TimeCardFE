import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { ClockOutTime } from '../types'
export const usePostClockOutTime = () => {
  const postClockOutTime = async (clockOutTimeData: ClockOutTime) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/attendance-records/clock-out`, 
      clockOutTimeData,
      { withCredentials: true }
    );
    return response.data;
  };
  return useMutation(postClockOutTime, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
        console.log(error);
    },
  });
};