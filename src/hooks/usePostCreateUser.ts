import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { User } from '../types'
export const usePostCreateUser = () => {
  const postCreateUser = async (userData:User) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/create-user`, 
       userData,
      { withCredentials: true }
    );
    return response.data;
  };
  return useMutation(postCreateUser, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
        console.log(error);
    },
  });
};
